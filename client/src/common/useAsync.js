import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PubSub from './PubSub'

export function useAsync(fn, deps = []) {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function run() {
    setLoading(true)
    const { data: result, error } = await fn()
    if (error) {
      PubSub.publish('show_info', { header: t('common.error'), text: error.message })
    } else {
      setData(result)
    }
    setLoading(false)
  }

  useEffect(() => { run() }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, refresh: run }
}
