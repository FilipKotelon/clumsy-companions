export enum GamePhaseType {
  ActionPhase = 'action',
  PreparationPhase = 'preparation'
}

export class GamePhase {
  constructor(
    readonly type: GamePhaseType,
    readonly name: string,
  ) {}
}

export const FirstPlayPhase = new GamePhase(
  GamePhaseType.PreparationPhase,
  'FirstPlayPhase'
)

export const AttackPhase = new GamePhase(
  GamePhaseType.ActionPhase,
  'AttackPhase'
)

export const DefensePhase = new GamePhase(
  GamePhaseType.ActionPhase,
  'DefensePhase'
)

export const DamagePhase = new GamePhase(
  GamePhaseType.ActionPhase,
  'DamagePhase'
)

export const SecondPlayPhase = new GamePhase(
  GamePhaseType.PreparationPhase,
  'SecondPlayPhase'
)