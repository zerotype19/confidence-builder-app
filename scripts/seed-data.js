// Sample data for seeding the database
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Child = require('../models/Child');
const Pillar = require('../models/Pillar');
const Activity = require('../models/Activity');
const Challenge = require('../models/Challenge');
const connectDB = require('../config/db');

// Connect to database
connectDB();

// Seed data function
const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Child.deleteMany({});
    await Pillar.deleteMany({});
    await Activity.deleteMany({});
    await Challenge.deleteMany({});
    
    console.log('Creating admin user...');
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    console.log('Creating demo parent user...');
    
    // Create demo parent user
    const parentPassword = await bcrypt.hash('parent123', salt);
    
    const parentUser = await User.create({
      email: 'parent@example.com',
      password: parentPassword,
      firstName: 'Demo',
      lastName: 'Parent',
      role: 'parent'
    });
    
    console.log('Creating the 5 pillars...');
    
    // Create the 5 pillars
    const pillars = await Pillar.insertMany([
      {
        name: 'Independence & Problem-Solving',
        description: 'Building a child\'s ability to think for themselves, make decisions, and solve problems without constant adult intervention.',
        order: 1,
        icon: 'independence-icon.png',
        techniques: [
          {
            name: 'The "Ask, Don\'t Tell" Method',
            description: 'Instead of giving direct answers or solutions, respond to children\'s questions with guiding questions that help them think through problems.',
            steps: [
              'When your child asks for help, pause before jumping in',
              'Ask "What do you think you could try?"',
              'Follow up with "What else could you try if that doesn\'t work?"',
              'Provide guidance only after they\'ve attempted their own solutions'
            ],
            examples: [
              {
                scenario: 'Child can\'t find their shoes',
                incorrectResponse: 'They\'re under the couch. I\'ll get them.',
                correctResponse: 'Where have you already looked? Where did you take them off yesterday?'
              }
            ],
            troubleshooting: [
              {
                problem: 'Child gets frustrated and gives up',
                solution: 'Break the problem into smaller steps and ask about one step at a time'
              }
            ]
          }
        ],
        ageAdaptations: {
          toddler: {
            description: 'Focus on simple choices and basic problem-solving with immediate feedback',
            examples: ['Let them choose between two options', 'Create simple obstacle courses']
          },
          elementary: {
            description: 'Introduce more complex problems with multiple solutions',
            examples: ['Use "what would you do if" scenarios', 'Create checklists for morning routines']
          },
          teen: {
            description: 'Focus on decision-making with long-term consequences',
            examples: ['Discuss hypothetical scenarios with pros and cons', 'Allow them to plan family activities']
          }
        }
      },
      {
        name: 'Growth Mindset & Resilience',
        description: 'Developing a child\'s belief that abilities can be developed through dedication and hard work, and building the capacity to recover from difficulties.',
        order: 2,
        icon: 'growth-icon.png',
        techniques: [
          {
            name: 'The Power of "Yet"',
            description: 'Adding the word "yet" to statements about inability helps children understand that skills develop over time with practice.',
            steps: [
              'When your child says "I can\'t do this," add "yet" to the end',
              'Share stories of your own learning journey',
              'Celebrate effort and improvement, not just success',
              'Discuss famous failure-to-success stories'
            ],
            examples: [
              {
                scenario: 'Child struggles with math homework',
                incorrectResponse: 'Maybe you\'re just not good at math.',
                correctResponse: 'You haven\'t mastered this concept yet, but you will with practice.'
              }
            ],
            troubleshooting: [
              {
                problem: 'Child continues negative self-talk',
                solution: 'Create a "fixed mindset vs. growth mindset" chart to identify language patterns'
              }
            ]
          }
        ],
        ageAdaptations: {
          toddler: {
            description: 'Use simple language and immediate examples',
            examples: ['Read stories about characters who persevere', 'Use puppets to demonstrate trying again']
          },
          elementary: {
            description: 'Connect effort to outcomes with concrete examples',
            examples: ['Keep a "growth journal" to track progress', 'Discuss learning from mistakes']
          },
          teen: {
            description: 'Apply growth mindset to academic and social challenges',
            examples: ['Analyze setbacks as learning opportunities', 'Discuss brain plasticity and neurological growth']
          }
        }
      },
      {
        name: 'Social Confidence & Communication',
        description: 'Building a child\'s ability to express themselves clearly, interact positively with others, and navigate social situations with confidence.',
        order: 3,
        icon: 'social-icon.png',
        techniques: [
          {
            name: 'Conversation Starters',
            description: 'Equipping children with phrases and questions they can use to initiate conversations with peers and adults.',
            steps: [
              'Brainstorm interesting questions together',
              'Role-play conversation scenarios at home',
              'Practice active listening skills',
              'Gradually increase social exposure'
            ],
            examples: [
              {
                scenario: 'Child is nervous about making friends at a new school',
                incorrectResponse: 'Just go talk to someone. It\'s not that hard.',
                correctResponse: 'Let\'s practice some questions you could ask to get to know someone, like "What do you like to do after school?"'
              }
            ],
            troubleshooting: [
              {
                problem: 'Child freezes in actual social situations',
                solution: 'Start with structured activities where conversation happens naturally'
              }
            ]
          }
        ],
        ageAdaptations: {
          toddler: {
            description: 'Focus on basic greetings and sharing',
            examples: ['Practice saying hello and goodbye', 'Use puppets for social stories']
          },
          elementary: {
            description: 'Develop friendship skills and conflict resolution',
            examples: ['Role-play playground scenarios', 'Practice joining group activities']
          },
          teen: {
            description: 'Address complex social dynamics and digital communication',
            examples: ['Discuss handling peer pressure', 'Practice job interview skills']
          }
        }
      },
      {
        name: 'Purpose & Strength Discovery',
        description: 'Helping children identify their unique strengths, interests, and values to develop a sense of purpose and direction.',
        order: 4,
        icon: 'purpose-icon.png',
        techniques: [
          {
            name: 'Strength Spotting',
            description: 'Actively observing and naming specific character strengths and talents you notice in your child.',
            steps: [
              'Observe your child in different settings',
              'Name specific strengths you notice (e.g., creativity, persistence)',
              'Provide concrete examples of when they demonstrated these strengths',
              'Help them see how their strengths can help others'
            ],
            examples: [
              {
                scenario: 'Child helps a younger sibling with a puzzle',
                incorrectResponse: 'You\'re such a good kid.',
                correctResponse: 'I noticed how patient you were explaining the puzzle to your sister. Your patience and clear instructions really helped her succeed.'
              }
            ],
            troubleshooting: [
              {
                problem: 'Child dismisses or downplays strengths',
                solution: 'Create a "strength evidence journal" to document examples'
              }
            ]
          }
        ],
        ageAdaptations: {
          toddler: {
            description: 'Focus on basic interests and simple helping roles',
            examples: ['Offer varied activities to discover interests', 'Create simple helper jobs']
          },
          elementary: {
            description: 'Explore talents and community contributions',
            examples: ['Try different clubs and activities', 'Participate in age-appropriate service projects']
          },
          teen: {
            description: 'Connect strengths to future goals and values',
            examples: ['Explore career paths aligned with strengths', 'Develop leadership opportunities']
          }
        }
      },
      {
        name: 'Managing Fear & Anxiety',
        description: 'Equipping children with tools to understand, express, and manage their fears and anxieties in healthy ways.',
        order: 5,
        icon: 'anxiety-icon.png',
        techniques: [
          {
            name: 'Worry Time',
            description: 'Setting aside a specific, limited time each day for children to express their worries, which helps contain anxiety and develop coping strategies.',
            steps: [
              'Schedule 10-15 minutes of "worry time" each day',
              'During this time, listen to all worries without judgment',
              'Help categorize worries as controllable or uncontrollable',
              'Develop action plans for controllable worries'
            ],
            examples: [
              {
                scenario: 'Child worries throughout the day about an upcoming test',
                incorrectResponse: 'Stop worrying so much. You\'ll be fine.',
                correctResponse: 'Let\'s save that worry for our worry time this evening. Then we can make a plan for how to prepare for the test.'
              }
            ],
            troubleshooting: [
              {
                problem: 'Child\'s anxiety doesn\'t decrease with worry time',
                solution: 'Add relaxation techniques like deep breathing or visualization'
              }
            ]
          }
        ],
        ageAdaptations: {
          toddler: {
            description: 'Use simple emotional language and immediate comfort',
            examples: ['Name feelings with picture books', 'Create comfort items for scary situations']
          },
          elementary: {
            description: 'Develop concrete coping strategies',
            examples: ['Create a "worry monster" that eats written worries', 'Practice deep breathing techniques']
          },
          teen: {
            description: 'Address complex fears and develop long-term coping skills',
            examples: ['Discuss cognitive distortions', 'Create personalized anxiety management plans']
          }
        }
      }
    ]);
    
    console.log('Creating sample activities...');
    
    // Create sample activities
    const activities = await Activity.insertMany([
      {
        pillarId: pillars[0]._id, // Independence & Problem-Solving
        title: 'Morning Routine Checklist',
        description: 'Create a visual checklist of morning tasks that your child can complete independently.',
        ageGroup: 'elementary',
        duration: 30,
        materials: ['Poster board', 'Markers', 'Stickers', 'Optional: lamination'],
        steps: [
          'Sit down with your child and list all morning tasks (brush teeth, get dressed, etc.)',
          'Create a colorful chart with each task illustrated',
          'Let your child check off or move a marker as each task is completed',
          'Gradually reduce your reminders over time'
        ],
        learningOutcomes: [
          'Develops independence in daily routines',
          'Builds time management skills',
          'Creates sense of accomplishment'
        ],
        tips: [
          'Take a photo of your child doing each task for a personalized chart',
          'Include a small reward for completing all tasks independently for a week',
          'Adjust the checklist as your child masters certain tasks'
        ],
        difficulty: 'easy',
        tags: ['routine', 'independence', 'morning']
      },
      {
        pillarId: pillars[1]._id, // Growth Mindset & Resilience
        title: 'The "Power of Yet" Journal',
        description: 'Create a journal to track progress on challenging skills and celebrate growth over time.',
        ageGroup: 'elementary',
        duration: 45,
        materials: ['Notebook', 'Art supplies', 'Photos (optional)'],
        steps: [
          'Help your child identify a skill they want to improve',
          'Take a "before" picture or have them write/draw their current ability level',
          'Create a practice plan with small, achievable steps',
          'Document progress weekly with notes, drawings, or photos',
          'Review the journal monthly to celebrate growth'
        ],
        learningOutcomes: [
          'Visualizes progress over time',
          'Connects effort with improvement',
          'Builds persistence through challenges'
        ],
        tips: [
          'Include quotes about growth mindset throughout the journal',
          'Add a section for "What I learned from mistakes"',
          'Include both physical skills (sports, writing) and character skills (patience, sharing)'
        ],
        difficulty: 'medium',
        tags: ['growth mindset', 'journal', 'progress tracking']
      },
      {
        pillarId: pillars[2]._id, // Social Confidence & Communication
        title: 'Conversation Jar',
        description: 'Create a jar of conversation starters for your child to practice social communication skills.',
        ageGroup: 'all',
        duration: 20,
        materials: ['Jar or container', 'Paper strips', 'Pens or markers'],
        steps: [
          'Brainstorm interesting questions with your child',
          'Write each question on a strip of paper',
          'Decorate the jar',
          'Practice by drawing questions during family meals',
          'Role-play how to use these questions with new friends'
        ],
        learningOutcomes: [
          'Develops conversation initiation skills',
          'Builds active listening habits',
          'Increases comfort with social interactions'
        ],
        tips: [
          'Include a mix of light and deeper questions',
          'Add new questions regularly to keep it fresh',
          'Practice follow-up questions based on answers'
        ],
        difficulty: 'easy',
        tags: ['communication', 'social skills', 'conversation']
      },
      {
        pillarId: pillars[3]._id, // Purpose & Strength Discovery
        title: 'St<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>