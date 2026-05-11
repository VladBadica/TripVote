import { createContext, useContext, useState } from 'react'

const TripContext = createContext(null)

export function TripProvider({ children }) {


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

  function toggleChecklistItem(itemId) {
    setChecklist(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item
        return { ...item, done: !item.done }
      })
    )
  }

  function deleteChecklistItem(itemId) {
    setChecklist(prev => prev.filter(c => c.id !== itemId))
  }

  return (
    <TripContext.Provider value={{
      createPoll,
      castVote,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
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
