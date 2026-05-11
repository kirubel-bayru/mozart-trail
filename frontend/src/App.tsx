import { AppShell, Anchor, Group, NavLink, Title } from '@mantine/core'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
]

function App() {
  const location = useLocation()

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>Starter Kit</Title>
          <Group gap="xs">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                component={Link}
                to={item.to}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Anchor
          href="https://mantine.dev"
          target="_blank"
          rel="noreferrer"
          mt="xl"
          display="inline-block"
        >
          Mantine Docs
        </Anchor>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
