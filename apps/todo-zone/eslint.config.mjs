import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      // App « legacy » volontaire : NgModules + composants non-standalone.
      '@angular-eslint/prefer-standalone': 'off',
      // Injection par constructeur et CD Default : c'est précisément ce que l'app montre.
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'zn',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'zn',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // App « legacy » volontaire : *ngIf / *ngFor / ngSwitch au lieu de @if / @for / @switch.
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
];
