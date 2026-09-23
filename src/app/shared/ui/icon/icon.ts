import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type StrokeLinecap = 'butt' | 'round' | 'square';
type StrokeLinejoin = 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';

interface IconDefinition {
  readonly viewBox: string;
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly strokeLinecap?: StrokeLinecap;
  readonly strokeLinejoin?: StrokeLinejoin;
}

const ICON_DEFINITIONS = {
  'botanical-branch': { viewBox: '0 0 120 90', fill: 'none' },
  'categories-grid': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'chevron-down': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
  },
  'chevron-down-wide': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'chevron-left': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'chevron-right': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  check: {
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  close: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
  },
  customers: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  },
  'dashboard-grid': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'delivery-truck': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'eco-bag': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  home: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  heart: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  info: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'leaf-sprout': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
  },
  logout: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.55,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  menu: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
  },
  package: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  },
  plant: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  cart: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  search: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
  },
  'shield-check': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  shop: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'shopping-bag': {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  },
  sort: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-alphabetical-asc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-alphabetical-desc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-count-asc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-count-desc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-price-asc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  'sort-price-desc': {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  star: {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  tag: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  user: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  users: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICON_DEFINITIONS;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
  },
  selector: 'app-icon',
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }

    svg {
      display: block;
      height: 100%;
      width: 100%;
    }
  `,
  templateUrl: './icon.html',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly strokeWidth = input<string | number | undefined>(undefined, { alias: 'stroke-width' });
  readonly strokeLinecap = input<StrokeLinecap | null | undefined>(undefined, {
    alias: 'stroke-linecap',
  });
  readonly strokeLinejoin = input<StrokeLinejoin | null | undefined>(undefined, {
    alias: 'stroke-linejoin',
  });

  protected readonly definition = computed<IconDefinition>(() => ICON_DEFINITIONS[this.name()]);
  protected readonly resolvedStrokeWidth = computed(
    () => this.strokeWidth() ?? this.definition().strokeWidth,
  );
  protected readonly resolvedStrokeLinecap = computed(() =>
    this.strokeLinecap() === undefined
      ? this.definition().strokeLinecap
      : (this.strokeLinecap() ?? undefined),
  );
  protected readonly resolvedStrokeLinejoin = computed(() =>
    this.strokeLinejoin() === undefined
      ? this.definition().strokeLinejoin
      : (this.strokeLinejoin() ?? undefined),
  );
}
