import { feedback } from './data'

/**
 * One POST to whatever form service `feedback.endpoint` names — FormSubmit
 * today, which turns it into an email to the inbox with no account or key.
 *
 * False when no service is set, when the request fails, and when the service
 * answers 200 but says no in the body: FormSubmit does exactly that before its
 * one-time activation, so trusting the status alone would thank a visitor for
 * a message that never arrived.
 *
 * Shared by the "Your take" tile at the end of each case study and the contact
 * dialog, so both go to the same place and fail the same honest way.
 */
export async function sendForm(payload: Record<string, string>): Promise<boolean> {
  if (!feedback.endpoint) return false
  try {
    const body = feedback.accessKey ? { access_key: feedback.accessKey, ...payload } : payload
    const res = await fetch(feedback.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return false
    const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null
    return !(data && (data.success === false || data.success === 'false'))
  } catch {
    return false
  }
}

/** true when a form service is configured, so a send goes to the inbox */
export const formLive = () => Boolean(feedback.endpoint)
