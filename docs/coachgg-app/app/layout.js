import '../styles/main.css'
import '../styles/components.css'

export const metadata = {
  title: 'CoachGG - Level up your esports game',
  description: 'CoachGG empowers gamers to grow from casual players to competitive pros by turning data into insight, and insight into action.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}