import { Drawer, Badge, Button, Text, Group, Stack, Divider } from '@mantine/core'
import type { MozartLocation } from '../data/locations'
import type { RouteResult } from '../lib/ors'
import { formatDuration } from '../lib/ors'
import { formatDistance } from '../lib/geo'
import { C, F } from '../theme'

interface LocationDetailDrawerProps {
  location: MozartLocation | null
  isBrowseMode: boolean
  hasUserPosition: boolean
  route: RouteResult | null
  isLoadingRoute: boolean
  onClose: () => void
  onGetDirections: (loc: MozartLocation) => void
  onClearRoute: () => void
}

export function LocationDetailDrawer({
  location,
  isBrowseMode,
  hasUserPosition,
  route,
  isLoadingRoute,
  onClose,
  onGetDirections,
  onClearRoute,
}: LocationDetailDrawerProps) {
  const canSeeContent = location?.unlocked || isBrowseMode

  return (
    <Drawer
      opened={!!location}
      onClose={onClose}
      position="bottom"
      size="auto"
      radius="lg"
      zIndex={1500}
      withCloseButton={false}
      styles={{
        body: { padding: '20px 20px 32px' },
        content: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      {location && (
        <Stack gap="md">
          {/* Drag handle */}
          <div style={{ width: 40, height: 4, background: '#e0e0e0', borderRadius: 2, margin: '0 auto -8px' }} />

          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" fw={700} c={C.secondary} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: F.body }}>
                Stop {location.order} of 12 · {location.year}
              </Text>
              <Text size="xl" fw={700} c="#1a1a1a" mt={2}>
                {location.name}
              </Text>
            </div>
            <Group gap={6}>
              {location.unlocked ? (
                <Badge color="green" variant="light" size="sm">Unlocked</Badge>
              ) : isBrowseMode ? (
                <Badge color="blue" variant="light" size="sm">Preview</Badge>
              ) : (
                <Badge color="gray" variant="light" size="sm">Locked</Badge>
              )}
              <Badge
                variant="light"
                size="sm"
                style={{ background: 'rgba(201,162,39,0.1)', color: C.secondary, border: `1px solid rgba(201,162,39,0.3)` }}
              >
                +{location.points} pts
              </Badge>
            </Group>
          </Group>

          <Divider />

          {/* Content */}
          {canSeeContent ? (
            <Text size="sm" lh={1.7} c="#444">
              {location.description}
            </Text>
          ) : (
            <Stack align="center" gap="xs" py="md">
              <Text size="2xl">🔒</Text>
              <Text fw={600} c="#333">Location locked</Text>
              <Text size="sm" c="dimmed" ta="center">
                Walk within 50 metres of this location to unlock its story and earn {location.points} points.
              </Text>
            </Stack>
          )}

          {/* Directions */}
          {route && (
            <div style={{
              background: 'rgba(139,0,0,0.06)',
              border: '1px solid rgba(139,26,26,0.15)',
              borderRadius: 10,
              padding: '10px 14px',
            }}>
              <Group justify="space-between">
                <Group gap={6}>
                  <Text size="sm" fw={700} c={C.primary}>🚶 Walking route</Text>
                  <Text size="sm" c="dimmed">
                    {formatDistance(route.distanceM)} · {formatDuration(route.durationSec)}
                  </Text>
                </Group>
                <Button size="xs" variant="subtle" c="dimmed" onClick={onClearRoute} p={0}>
                  Clear
                </Button>
              </Group>
            </div>
          )}

          {/* Actions */}
          <Group grow>
            {hasUserPosition && (
              <Button
                variant="filled"
                style={{ background: C.primary }}
                loading={isLoadingRoute}
                onClick={() => onGetDirections(location)}
                leftSection={<span>🧭</span>}
              >
                {route ? 'Update Route' : 'Get Directions'}
              </Button>
            )}
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </Group>
        </Stack>
      )}
    </Drawer>
  )
}
