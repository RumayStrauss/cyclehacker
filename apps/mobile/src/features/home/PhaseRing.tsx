import type { CyclePhase, PhaseBoundaries } from '@cyclehacker/prediction-engine';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { fonts, phaseColors } from '@/theme';

const SIZE = 280;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const GAP_DEGREES = 6;

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulatory: 'Ovulatory',
  luteal: 'Luteal',
};

function pointOnCircle(angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(angleRad), y: CENTER + RADIUS * Math.sin(angleRad) };
}

function arcPath(startDeg: number, endDeg: number) {
  const start = pointOnCircle(startDeg);
  const end = pointOnCircle(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

interface PhaseSegment {
  phase: CyclePhase;
  startDay: number;
  endDay: number;
}

function segmentsFromBoundaries(boundaries: PhaseBoundaries): PhaseSegment[] {
  return [
    { phase: 'menstrual', startDay: boundaries.menstrualStart, endDay: boundaries.menstrualEnd },
    { phase: 'follicular', startDay: boundaries.follicularStart, endDay: boundaries.follicularEnd },
    { phase: 'ovulatory', startDay: boundaries.ovulatoryStart, endDay: boundaries.ovulatoryEnd },
    { phase: 'luteal', startDay: boundaries.lutealStart, endDay: boundaries.lutealEnd },
  ];
}

interface PhaseRingProps {
  cycleDay: number;
  phase: CyclePhase;
  boundaries: PhaseBoundaries;
}

/** Day 1 sits at 12 o'clock; the ring reads clockwise through the cycle. */
export function PhaseRing({ cycleDay, phase, boundaries }: PhaseRingProps) {
  const { cycleLength } = boundaries;
  const dayToDegrees = (day: number) => ((day - 1) / cycleLength) * 360;
  const todayAngle = dayToDegrees(Math.min(cycleDay, cycleLength));
  const todayPoint = pointOnCircle(todayAngle);

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#ffffff0d" strokeWidth={STROKE} fill="none" />
        {segmentsFromBoundaries(boundaries).map((segment) => {
          const startDeg = dayToDegrees(segment.startDay) + GAP_DEGREES / 2;
          const endDeg = dayToDegrees(segment.endDay + 1) - GAP_DEGREES / 2;
          if (endDeg <= startDeg) return null;
          return (
            <Path
              key={segment.phase}
              d={arcPath(startDeg, endDeg)}
              stroke={phaseColors[segment.phase]}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
        <Circle cx={todayPoint.x} cy={todayPoint.y} r={7} fill="#ffffff" />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.phaseLabel}>{PHASE_LABELS[phase]}</Text>
        <Text style={styles.phaseSubLabel}>Phase</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', gap: 8 },
  phaseLabel: { fontFamily: fonts.display, fontSize: 28, color: '#ffffff' },
  phaseSubLabel: { fontFamily: fonts.extraBold, fontSize: 16, color: '#ffffff', letterSpacing: 1 },
});
