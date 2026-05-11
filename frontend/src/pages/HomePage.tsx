import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Container,
  Divider,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { fetchHealth } from '../lib/api'

export function HomePage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  })

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Paper
          radius="lg"
          p="xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(32,201,151,0.12) 0%, rgba(76,110,245,0.12) 100%)',
            border: '1px solid rgba(76, 110, 245, 0.2)',
          }}
        >
          <Stack gap="md">
            <Badge variant="light" size="lg" w="fit-content">
              Team Starter
            </Badge>
            <Title order={1} style={{ lineHeight: 1.2 }}>
              Build fast with a clean full-stack foundation
            </Title>
            <Text size="lg" c="dimmed" maw={760}>
              React + TypeScript + React Query + React Router + Mantine on the frontend, and
              Express + PostgreSQL on the backend. Everything is wired and ready for your first
              feature.
            </Text>
            <Group>
              <Button onClick={() => healthQuery.refetch()} loading={healthQuery.isFetching}>
                Check backend status
              </Button>
              <Button variant="default" component="a" href="/about">
                See stack details
              </Button>
            </Group>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius="md" p="lg" h="100%">
            <Stack>
              <Group justify="space-between">
                <Text fw={700}>API connectivity</Text>
                {healthQuery.data?.status === 'ok' ? (
                  <Badge color="green">Online</Badge>
                ) : healthQuery.isError ? (
                  <Badge color="red">Offline</Badge>
                ) : (
                  <Badge color="gray">Unknown</Badge>
                )}
              </Group>

              {healthQuery.isError && (
                <Alert color="red" title="Backend unavailable">
                  {(healthQuery.error as Error).message}
                </Alert>
              )}

              {healthQuery.isSuccess && (
                <Alert color="green" title="API is reachable">
                  <Code block>{JSON.stringify(healthQuery.data, null, 2)}</Code>
                </Alert>
              )}

              {!healthQuery.isError && !healthQuery.isSuccess && (
                <Text c="dimmed">Run the backend and refresh the status.</Text>
              )}
            </Stack>
          </Card>

          <Card withBorder radius="md" p="lg" h="100%">
            <Stack>
              <Text fw={700}>Next setup steps</Text>
              <List
                spacing="sm"
                icon={
                  <ThemeIcon color="blue" size={20} radius="xl">
                    <Box component="span" fw={700}>
                      +
                    </Box>
                  </ThemeIcon>
                }
              >
                <List.Item>Create feature folders by domain.</List.Item>
                <List.Item>Add auth and protected routes.</List.Item>
                <List.Item>Introduce DB migrations.</List.Item>
                <List.Item>Set up CI and test pipelines.</List.Item>
              </List>
            </Stack>
          </Card>
        </SimpleGrid>

        <Divider label="What is included" labelPosition="center" />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card withBorder radius="md" p="md">
            <Text fw={600}>React + TS</Text>
            <Text c="dimmed" size="sm">
              Type-safe UI development with modern React patterns.
            </Text>
          </Card>
          <Card withBorder radius="md" p="md">
            <Text fw={600}>React Query</Text>
            <Text c="dimmed" size="sm">
              Server state management, caching, and refetch controls.
            </Text>
          </Card>
          <Card withBorder radius="md" p="md">
            <Text fw={600}>Express API</Text>
            <Text c="dimmed" size="sm">
              Lightweight backend routes ready for feature modules.
            </Text>
          </Card>
          <Card withBorder radius="md" p="md">
            <Text fw={600}>PostgreSQL</Text>
            <Text c="dimmed" size="sm">
              Production-grade relational database integration starter.
            </Text>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
