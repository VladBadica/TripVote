import { createContext, useContext, useState } from 'react'
import { mockTrips, mockPolls, mockChecklist, mockActivities } from '../mock/mockData'

const TripContext = createContext(null)

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(mockTrips)
  const [polls, setPolls] = useState(mockPolls)
  const [checklist, setChecklist] = useState(mockChecklist)
  const [activities, setActivities] = useState(mockActivities)

  function createTrip(tripData) {
    const newTrip = {
      id: `trip-${Date.now()}`,
      memberCount: 1,
      status: 'planning',
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      coverEmoji: '✈️',
      ...tripData
    }
    setTrips(prev => [newTrip, ...prev])
    addActivity(newTrip.id, 'trip_created', 'You', 'created the trip 🎉')
    return newTrip
  }

  function getTripById(id) {
    return trips.find(t => t.id === id) ?? null
  }

  function getPollsByTrip(tripId) {
    return polls.filter(p => p.tripId === tripId)
  }

  function createPoll(tripId, question, type, options) {
    const newPoll = {
      id: `poll-${Date.now()}`,
      tripId,
      type,
      question,
      createdBy: 'You',
      createdAt: new Date().toISOString(),
      closed: false,
      options: options.map((label, i) => ({ id: `opt-${Date.now()}-${i}`, label, votes: [] }))
    }
    setPolls(prev => [newPoll, ...prev])
    addActivity(tripId, 'poll_created', 'You', `created a new poll: "${question}"`)
    return newPoll
  }

  function castVote(pollId, optionId, userId) {
    setPolls(prev =>
      prev.map(poll => {
        if (poll.id !== pollId) return poll
        return {
          ...poll,
          options: poll.options.map(opt => {
            if (opt.id !== optionId) return { ...opt, votes: opt.votes.filter(v => v !== userId) }
            return opt.votes.includes(userId)
              ? opt
              : { ...opt, votes: [...opt.votes, userId] }
          })
        }
      })
    )
  }

  function getChecklistByTrip(tripId) {
    return checklist.filter(c => c.tripId === tripId)
  }

  function addChecklistItem(tripId, text) {
    const item = {
      id: `chk-${Date.now()}`,
      tripId,
      text,
      done: false,
      assignee: null,
      dueDate: null
    }
    setChecklist(prev => [...prev, item])
  }

  function toggleChecklistItem(itemId, actorName) {
    setChecklist(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item
        const done = !item.done
        if (done) addActivity(item.tripId, 'checklist_done', actorName, `completed "${item.text}"`)
        return { ...item, done }
      })
    )
  }

  function deleteChecklistItem(itemId) {
    setChecklist(prev => prev.filter(c => c.id !== itemId))
  }

  function getActivitiesByTrip(tripId) {
    return activities
      .filter(a => a.tripId === tripId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  function addActivity(tripId, type, actor, message) {
    const item = {
      id: `act-${Date.now()}`,
      tripId,
      type,
      actor,
      message,
      timestamp: new Date().toISOString()
    }
    setActivities(prev => [item, ...prev])
  }

  return (
    <TripContext.Provider value={{
      trips,
      createTrip,
      getTripById,
      getPollsByTrip,
      createPoll,
      castVote,
      getChecklistByTrip,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      getActivitiesByTrip
    }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be used within TripProvider')
  return ctx
}
