const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   POST /api/seed/demo
// @desc    Seed rich sample data for current user
router.post('/demo', async (req, res) => {
  try {
    const userId = req.user._id;

    // Optional: clear existing data for this user
    await Promise.all([
      Contact.deleteMany({ user: userId }),
      Deal.deleteMany({ user: userId }),
      Task.deleteMany({ user: userId }),
      Activity.deleteMany({ user: userId })
    ]);

    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    // 1. Create Contacts
    const contactData = [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@hyperflow.io',
        phone: '+1 (555) 234-5678',
        company: 'HyperFlow Technologies',
        jobTitle: 'VP of Product',
        status: 'Qualified',
        lastContactedDate: daysAgo(1),
        notes: 'Very interested in enterprise multi-seat expansion. Key decision maker.',
        avatarColor: 'teal'
      },
      {
        name: 'Michael Chen',
        email: 'mchen@apexlogistics.com',
        phone: '+1 (555) 876-5432',
        company: 'Apex Global Logistics',
        jobTitle: 'Chief Operating Officer',
        status: 'Contacted',
        lastContactedDate: daysAgo(3),
        notes: 'Looking to replace their legacy CRM across 120 dispatch coordinators.',
        avatarColor: 'cyan'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@novapharma.co',
        phone: '+1 (555) 345-9871',
        company: 'Nova BioPharma',
        jobTitle: 'Head of Commercial Sales',
        status: 'Qualified',
        lastContactedDate: daysAgo(2),
        notes: 'Compliance and HIPAA security audit passed. Contract in negotiation.',
        avatarColor: 'emerald'
      },
      {
        name: 'Marcus Brody',
        email: 'mbrody@vanguardfin.com',
        phone: '+1 (555) 901-2345',
        company: 'Vanguard Fintech Capital',
        jobTitle: 'Managing Partner',
        status: 'New',
        lastContactedDate: daysAgo(5),
        notes: 'Inbound request from product webinar. Needs pitch deck.',
        avatarColor: 'amber'
      },
      {
        name: 'Aisha Al-Mansoor',
        email: 'aisha@cloudmatrix.ae',
        phone: '+971 4 392 1000',
        company: 'CloudMatrix Solutions',
        jobTitle: 'Chief Technology Officer',
        status: 'Qualified',
        lastContactedDate: daysAgo(1),
        notes: 'Closed annual contract last quarter, now adding API integration package.',
        avatarColor: 'purple'
      },
      {
        name: 'David Kim',
        email: 'dkim@pulsemedia.net',
        phone: '+1 (555) 432-8765',
        company: 'Pulse Digital Media',
        jobTitle: 'Director of Growth',
        status: 'Lost',
        lastContactedDate: daysAgo(14),
        notes: 'Budget freeze until Q3 next year. Keep on quarterly touchpoint list.',
        avatarColor: 'rose'
      },
      {
        name: 'Chloe Tremblay',
        email: 'chloe.t@zenithecommerce.com',
        phone: '+1 (555) 678-1234',
        company: 'Zenith Retail E-Commerce',
        jobTitle: 'Head of Customer Experience',
        status: 'Contacted',
        lastContactedDate: daysAgo(2),
        notes: 'Evaluating automated workflow triggers for 50 customer support reps.',
        avatarColor: 'indigo'
      }
    ];

    const createdContacts = await Contact.create(
      contactData.map((c) => ({ ...c, user: userId }))
    );

    // 2. Create Deals across the 5 Stages
    const dealsData = [
      {
        title: 'HyperFlow Enterprise License (150 Seats)',
        contact: createdContacts[0]._id,
        customerName: createdContacts[0].name,
        value: 48000,
        stage: 'Proposal Sent',
        expectedCloseDate: daysFromNow(10),
        priority: 'High',
        notes: 'Proposal sent with 15% annual commitment discount.'
      },
      {
        title: 'Apex Logistics Fleet CRM Migration',
        contact: createdContacts[1]._id,
        customerName: createdContacts[1].name,
        value: 65000,
        stage: 'Negotiation',
        expectedCloseDate: daysFromNow(7),
        priority: 'High',
        notes: 'Finalizing Service Level Agreement and custom API sync terms.'
      },
      {
        title: 'Nova BioPharma Global Rollout',
        contact: createdContacts[2]._id,
        customerName: createdContacts[2].name,
        value: 92000,
        stage: 'Closed Won',
        expectedCloseDate: daysAgo(8),
        wonAt: daysAgo(8),
        priority: 'High',
        notes: 'Contract signed! Invoiced and onboarding scheduled for next Monday.'
      },
      {
        title: 'Vanguard Fintech Portal Integration',
        contact: createdContacts[3]._id,
        customerName: createdContacts[3].name,
        value: 28500,
        stage: 'Lead In',
        expectedCloseDate: daysFromNow(21),
        priority: 'Medium',
        notes: 'Initial discovery call requested through website lead form.'
      },
      {
        title: 'CloudMatrix API & Webhook Suite',
        contact: createdContacts[4]._id,
        customerName: createdContacts[4].name,
        value: 36000,
        stage: 'Closed Won',
        expectedCloseDate: daysAgo(35),
        wonAt: daysAgo(35),
        priority: 'Medium',
        notes: 'Annual recurring expansion deal confirmed.'
      },
      {
        title: 'Zenith E-Commerce Support Workflow',
        contact: createdContacts[6]._id,
        customerName: createdContacts[6].name,
        value: 19500,
        stage: 'Contact Made',
        expectedCloseDate: daysFromNow(18),
        priority: 'Medium',
        notes: 'Demo meeting scheduled for this Thursday 2 PM EST.'
      },
      {
        title: 'Previous Quarter Enterprise Expansion',
        customerName: 'Acrobat Logistics Group',
        value: 54000,
        stage: 'Closed Won',
        expectedCloseDate: daysAgo(68),
        wonAt: daysAgo(68),
        priority: 'High',
        notes: 'Closed enterprise expansion contract.'
      },
      {
        title: 'Summer SaaS Pilot Project',
        customerName: 'Nexis Cloud Labs',
        value: 22000,
        stage: 'Closed Won',
        expectedCloseDate: daysAgo(95),
        wonAt: daysAgo(95),
        priority: 'Medium',
        notes: 'Pilot completed successfully and converted to annual subscription.'
      }
    ];

    await Deal.create(dealsData.map((d) => ({ ...d, user: userId })));

    // 3. Create Tasks & Follow-ups
    const tasksData = [
      {
        title: 'Call Sarah Jenkins to review customized enterprise proposal',
        contact: createdContacts[0]._id,
        customerName: createdContacts[0].name,
        dueDate: now, // Due Today!
        completed: false,
        priority: 'High',
        taskType: 'Call',
        notes: 'Highlight HIPAA compliance and uptime guarantee.'
      },
      {
        title: 'Send revised SLA and security annex to Michael Chen',
        contact: createdContacts[1]._id,
        customerName: createdContacts[1].name,
        dueDate: now, // Due Today!
        completed: false,
        priority: 'High',
        taskType: 'Email',
        notes: 'Legal approved the indemnity amendment.'
      },
      {
        title: 'Host Product Architecture Demo with Zenith E-Commerce Team',
        contact: createdContacts[6]._id,
        customerName: createdContacts[6].name,
        dueDate: daysFromNow(2),
        completed: false,
        priority: 'Medium',
        taskType: 'Meeting',
        notes: 'Prepare automated customer trigger slide deck.'
      },
      {
        title: 'Send introductory CRM capability deck to Marcus Brody',
        contact: createdContacts[3]._id,
        customerName: createdContacts[3].name,
        dueDate: daysFromNow(1),
        completed: false,
        priority: 'Medium',
        taskType: 'Email',
        notes: 'Include fintech case study benchmarks.'
      },
      {
        title: 'Welcome onboarding kickoff call with Elena Rostova',
        contact: createdContacts[2]._id,
        customerName: createdContacts[2].name,
        dueDate: daysAgo(2),
        completed: true,
        priority: 'High',
        taskType: 'Call',
        notes: 'Introduction to account manager completed.'
      }
    ];

    await Task.create(tasksData.map((t) => ({ ...t, user: userId })));

    // 4. Create Activity Timeline Entries
    const activitiesData = [
      {
        contact: createdContacts[0]._id,
        type: 'Meeting',
        title: 'Product Demo & Architecture Q&A',
        description: 'Met with VP of Product and 3 senior team leads. Demonstrated real-time Kanban pipelines and automated reporting.',
        date: daysAgo(2)
      },
      {
        contact: createdContacts[0]._id,
        type: 'Call',
        title: 'Initial Discovery Call',
        description: 'Discussed migration from legacy system and current bottlenecks in customer follow-ups.',
        date: daysAgo(6)
      },
      {
        contact: createdContacts[1]._id,
        type: 'Call',
        title: 'Executive Alignment Discussion',
        description: 'Discussed multi-branch deployment for 120 dispatchers. Michael confirmed procurement approval timeline.',
        date: daysAgo(3)
      },
      {
        contact: createdContacts[2]._id,
        type: 'Email',
        title: 'Executed Master Service Agreement',
        description: 'Received fully executed MSA from General Counsel. Deal officially won!',
        date: daysAgo(8)
      },
      {
        contact: createdContacts[6]._id,
        type: 'Call',
        title: 'Introductory Discovery Call',
        description: 'Reviewed high volume customer query management needs and scheduled in-depth team demonstration.',
        date: daysAgo(2)
      }
    ];

    await Activity.create(activitiesData.map((a) => ({ ...a, user: userId })));

    res.json({
      message: 'Demo workspace data seeded successfully!',
      stats: {
        contacts: createdContacts.length,
        deals: dealsData.length,
        tasks: tasksData.length,
        activities: activitiesData.length
      }
    });
  } catch (error) {
    console.error('Seed demo data error:', error);
    res.status(500).json({ message: error.message || 'Error seeding demo data' });
  }
});

module.exports = router;
