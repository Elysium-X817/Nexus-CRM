const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/dashboard/stats
// @desc    Get metrics for 4 summary cards, monthly sales bar chart, and today's follow-ups
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Total Contacts
    const totalContacts = await Contact.countDocuments({ user: userId });

    // 2. Active Deals
    const activeDealsList = await Deal.find({ user: userId, stage: { $ne: 'Closed Won' } });
    const activeDealsCount = activeDealsList.length;
    const activePipelineValue = activeDealsList.reduce((acc, d) => acc + (d.value || 0), 0);

    // 3. Total Revenue Won
    const wonDeals = await Deal.find({ user: userId, stage: 'Closed Won' });
    const totalRevenueWon = wonDeals.reduce((acc, d) => acc + (d.value || 0), 0);

    // 4. Pending Tasks
    const pendingTasksCount = await Task.countDocuments({ user: userId, completed: false });

    // 5. Today's Follow-ups (overdue or due today, not completed)
    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const todaysFollowUps = await Task.find({
      user: userId,
      completed: false,
      dueDate: { $lte: endOfToday }
    })
      .populate('contact', 'name email company phone')
      .sort({ dueDate: 1, priority: -1 })
      .limit(8);

    // 6. Monthly Sales Bar Chart (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      // Match won deals by wonAt date (or updatedAt/createdAt if wonAt not set)
      const wonInMonth = wonDeals.filter((deal) => {
        const dateToCheck = deal.wonAt || deal.updatedAt || deal.createdAt;
        const dealDate = new Date(dateToCheck);
        return dealDate >= startOfMonth && dealDate <= endOfMonth;
      });

      const revenue = wonInMonth.reduce((sum, item) => sum + (item.value || 0), 0);

      monthlySales.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
        revenue: revenue,
        count: wonInMonth.length
      });
    }

    // 7. Pipeline Stages Breakdown
    const stages = ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Closed Won'];
    const allDeals = await Deal.find({ user: userId });
    const stageSummary = stages.map((st) => {
      const dealsInStage = allDeals.filter((d) => d.stage === st);
      const stageValue = dealsInStage.reduce((sum, d) => sum + (d.value || 0), 0);
      return {
        stage: st,
        count: dealsInStage.length,
        value: stageValue
      };
    });

    // 8. Recent Activities
    const recentActivities = await Activity.find({ user: userId })
      .populate('contact', 'name company email')
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    res.json({
      cards: {
        totalContacts,
        activeDeals: activeDealsCount,
        activePipelineValue,
        totalRevenueWon,
        pendingTasks: pendingTasksCount
      },
      monthlySales,
      todaysFollowUps,
      stageSummary,
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message || 'Error fetching dashboard stats' });
  }
});

// @route   GET /api/dashboard/search
// @desc    Global search across contacts, deals, tasks
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ contacts: [], deals: [], tasks: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const userId = req.user._id;

    const [contacts, deals, tasks] = await Promise.all([
      Contact.find({
        user: userId,
        $or: [{ name: regex }, { email: regex }, { company: regex }, { jobTitle: regex }]
      }).limit(5),

      Deal.find({
        user: userId,
        $or: [{ title: regex }, { customerName: regex }]
      })
        .populate('contact', 'name company')
        .limit(5),

      Task.find({
        user: userId,
        $or: [{ title: regex }, { customerName: regex }, { notes: regex }]
      })
        .populate('contact', 'name company')
        .limit(5)
    ]);

    res.json({ contacts, deals, tasks });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: error.message || 'Error executing search' });
  }
});

module.exports = router;
