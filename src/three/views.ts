export type ViewId = 'intro' | 'overview' | 'desk' | 'wall' | 'corner'

type View = { label: string; position: [number, number, number]; target: [number, number, number] }

/** Camera presets. position = where the camera sits, target = what it looks at. */
export const VIEWS: Record<ViewId, View> = {
  intro: { label: 'Intro', position: [6.5, 4.2, 9.5], target: [0, 1, -1] },
  overview: { label: 'Overview', position: [3.4, 2.5, 4.8], target: [0, 1.1, -1.2] },
  desk: { label: 'Desk', position: [0.15, 1.7, 0.9], target: [0, 1.0, -1.7] },
  wall: { label: 'Wall', position: [-1.2, 1.9, -0.6], target: [-1.6, 1.8, -3.9] },
  corner: { label: 'Corner', position: [1.2, 1.7, -0.4], target: [2.9, 1.3, -2.9] },
}

/** Views shown as buttons in the HUD (intro is camera-only). */
export const VIEW_ORDER: Exclude<ViewId, 'intro'>[] = ['overview', 'desk', 'wall', 'corner']

export type PanelId = 'projects' | 'about' | 'awards' | 'contact' | 'resume' | 'bot'

/** Which camera view each hotspot pulls you to. */
export const PANEL_VIEW: Record<PanelId, ViewId> = {
  projects: 'desk',
  about: 'desk',
  resume: 'desk',
  awards: 'wall',
  contact: 'corner',
  bot: 'corner',
}

export const PANEL_TITLE: Record<PanelId, string> = {
  projects: 'Projects',
  about: 'About me',
  awards: 'Awards & photos',
  contact: 'Contact',
  resume: 'Résumé',
  bot: 'Lab assistant',
}
