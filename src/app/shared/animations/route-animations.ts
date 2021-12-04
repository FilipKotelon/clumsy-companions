import {
  trigger,
  transition,
  style,
  query,
  animate,
  group
} from '@angular/animations';

export const fader = trigger('routeAnimations', [
  transition('* => *', [
    query(':enter', [
        style({ opacity: 0 })
      ], { optional: true }
    ),
    group([
      query(':leave', [
          animate('600ms ease', style({ opacity: 0 }))
        ],
        { optional: true }
      ),
      query(':enter', [
          style({ opacity: 0 }),
          animate('600ms ease', style({ opacity: 1 }))
        ],
        { optional: true }
        )
    ])
  ])
])