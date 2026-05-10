export const mockUser = {
  id: 'user-1',
  email: 'alex@example.com',
  user_metadata: { full_name: 'Alex Rivera' }
}

export const mockTrips = [
  {
    id: 'trip-1',
    name: 'Greek Islands 🇬🇷',
    destination: 'Santorini, Greece',
    startDate: '2025-08-10',
    endDate: '2025-08-20',
    coverEmoji: '🏝️',
    memberCount: 5,
    status: 'planning',
    inviteCode: 'GRK2025'
  },
  {
    id: 'trip-2',
    name: 'Japan Cherry Blossoms 🌸',
    destination: 'Tokyo & Kyoto, Japan',
    startDate: '2025-04-01',
    endDate: '2025-04-12',
    coverEmoji: '⛩️',
    memberCount: 3,
    status: 'confirmed',
    inviteCode: 'JPN2025'
  },
  {
    id: 'trip-3',
    name: 'Weekend in Barcelona',
    destination: 'Barcelona, Spain',
    startDate: '2025-06-14',
    endDate: '2025-06-17',
    coverEmoji: '🦜',
    memberCount: 4,
    status: 'planning',
    inviteCode: 'BCN2025'
  }
]

export const mockMembers = [
  { id: 'user-1', name: 'Alex Rivera', avatar: '🧑', role: 'organizer' },
  { id: 'user-2', name: 'Sam Chen', avatar: '👩', role: 'member' },
  { id: 'user-3', name: 'Jordan Lee', avatar: '🧔', role: 'member' },
  { id: 'user-4', name: 'Priya Patel', avatar: '👩‍🦱', role: 'member' },
  { id: 'user-5', name: 'Marcus Kim', avatar: '🧑‍🦰', role: 'member' }
]

export const mockPolls = [
  {
    id: 'poll-1',
    tripId: 'trip-1',
    type: 'destination',
    question: 'Which island should we start with?',
    createdBy: 'Alex Rivera',
    createdAt: '2025-05-01T10:00:00Z',
    closed: false,
    options: [
      { id: 'opt-1', label: 'Santorini', votes: ['user-1', 'user-2', 'user-4'] },
      { id: 'opt-2', label: 'Mykonos', votes: ['user-3'] },
      { id: 'opt-3', label: 'Rhodes', votes: ['user-5'] }
    ]
  },
  {
    id: 'poll-2',
    tripId: 'trip-1',
    type: 'transport',
    question: 'How should we get to Greece?',
    createdBy: 'Sam Chen',
    createdAt: '2025-05-03T14:30:00Z',
    closed: false,
    options: [
      { id: 'opt-4', label: '✈️ Direct flight from JFK', votes: ['user-1', 'user-2', 'user-3'] },
      { id: 'opt-5', label: '✈️ Layover via Amsterdam', votes: ['user-4'] },
      { id: 'opt-6', label: '🚢 Ferry from Italy', votes: ['user-5'] }
    ]
  },
  {
    id: 'poll-3',
    tripId: 'trip-1',
    type: 'activity',
    question: 'Which activities are must-dos?',
    createdBy: 'Jordan Lee',
    createdAt: '2025-05-05T09:00:00Z',
    closed: true,
    options: [
      { id: 'opt-7', label: '🌅 Watch sunset at Oia', votes: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'] },
      { id: 'opt-8', label: '🏊 Boat tour', votes: ['user-1', 'user-3', 'user-5'] },
      { id: 'opt-9', label: '🍷 Wine tasting', votes: ['user-2', 'user-4'] }
    ]
  }
]

export const mockChecklist = [
  { id: 'chk-1', tripId: 'trip-1', text: 'Book flights', done: true, assignee: 'Alex Rivera', dueDate: '2025-05-15' },
  { id: 'chk-2', tripId: 'trip-1', text: 'Reserve hotel in Santorini', done: true, assignee: 'Sam Chen', dueDate: '2025-05-20' },
  { id: 'chk-3', tripId: 'trip-1', text: 'Apply for travel insurance', done: false, assignee: null, dueDate: '2025-06-01' },
  { id: 'chk-4', tripId: 'trip-1', text: 'Create shared packing list', done: false, assignee: 'Jordan Lee', dueDate: null },
  { id: 'chk-5', tripId: 'trip-1', text: 'Research ferry schedules between islands', done: false, assignee: null, dueDate: null },
  { id: 'chk-6', tripId: 'trip-1', text: 'Check visa requirements', done: true, assignee: 'Priya Patel', dueDate: null },
  { id: 'chk-7', tripId: 'trip-1', text: 'Set up group WhatsApp', done: true, assignee: 'Marcus Kim', dueDate: null }
]

export const mockActivities = [
  {
    id: 'act-1',
    tripId: 'trip-1',
    type: 'poll_created',
    actor: 'Jordan Lee',
    message: 'created a new poll: "Which activities are must-dos?"',
    timestamp: '2025-05-05T09:00:00Z'
  },
  {
    id: 'act-2',
    tripId: 'trip-1',
    type: 'checklist_done',
    actor: 'Alex Rivera',
    message: 'completed "Book flights"',
    timestamp: '2025-05-04T16:45:00Z'
  },
  {
    id: 'act-3',
    tripId: 'trip-1',
    type: 'member_joined',
    actor: 'Marcus Kim',
    message: 'joined the trip',
    timestamp: '2025-05-04T11:00:00Z'
  },
  {
    id: 'act-4',
    tripId: 'trip-1',
    type: 'poll_created',
    actor: 'Sam Chen',
    message: 'created a new poll: "How should we get to Greece?"',
    timestamp: '2025-05-03T14:30:00Z'
  },
  {
    id: 'act-5',
    tripId: 'trip-1',
    type: 'checklist_done',
    actor: 'Sam Chen',
    message: 'completed "Reserve hotel in Santorini"',
    timestamp: '2025-05-03T10:00:00Z'
  },
  {
    id: 'act-6',
    tripId: 'trip-1',
    type: 'trip_created',
    actor: 'Alex Rivera',
    message: 'created the trip 🎉',
    timestamp: '2025-05-01T09:00:00Z'
  }
]
