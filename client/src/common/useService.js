import { useTranslation } from 'react-i18next'
import PubSub from './PubSub'

export function useService() {
  const { t } = useTranslation()

  async function call(serviceFn, ...args) {
    const { data, error } = await serviceFn(...args)
    if (error) {
      PubSub.publish('show_info', {
        header: t('common.error'),
        text: error.message,
      })
      return null
    }
    return data
  }

  return call
}
