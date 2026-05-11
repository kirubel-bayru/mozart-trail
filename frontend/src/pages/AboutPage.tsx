import { Card, List, Stack, Text, Title } from '@mantine/core'

export function AboutPage() {
  return (
    <Stack>
      <Title order={2}>About this starter</Title>
      <Text c="dimmed">
        Use this as the shared baseline for your team. Add feature folders, auth, and domain
        modules from here.
      </Text>
      <Card withBorder radius="md" p="lg">
        <List spacing="xs">
          <List.Item>Frontend: React + TypeScript + React Query + React Router + Mantine</List.Item>
          <List.Item>Backend: Node.js + Express + TypeScript</List.Item>
          <List.Item>Database: PostgreSQL (`pg` driver configured)</List.Item>
          <List.Item>Developer experience: hot reload in both frontend and backend</List.Item>
        </List>
      </Card>
    </Stack>
  )
}
