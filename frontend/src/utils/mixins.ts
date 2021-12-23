import { Vue } from 'vue-property-decorator';
import { LoggerFactory } from 'lines-logger';
import type { Logger } from 'lines-logger';

const loggerFactory = new LoggerFactory(
  process.env.IS_DEBUG ? 'log_raise_error' : 'error',
);

/**
 * Injects $logger to every component
 */
export default class LoggerMixin extends Vue {
  private privateLogger!: Logger | null | undefined;

  public get $logger(): Logger {
    if (this.privateLogger !== null) {
      const { tag } = this.$vnode;
      // Provide logger only to vew component, exclude those one we don't need
      if (tag && !(/^vue-component-\d+-(transition|v-.*|-LoggerMixin)$/u).test(tag)) {
        this.privateLogger = loggerFactory.getLoggerColor(tag, '#35495e');
      } else {
        this.privateLogger = null;
      }
    }
    // Assume all components have logger
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.privateLogger!;
  }

  public updated(): void {
    if (this.$logger) {
      this.$logger.trace('Updated')();
    }
  }

  public created(): void {
    if (this.$logger) {
      this.$logger.trace('Created')();
    }
  }
}
