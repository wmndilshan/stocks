import { inngest } from '@/lib/inngest/client';
import { checkPriceAlerts } from '@/lib/actions/alert.actions';

export const checkAlertsScheduled = inngest.createFunction(
  { id: 'check-price-alerts' },
  { cron: '*/5 * * * *' }, // Every 5 minutes
  async ({ step }) => {
    return await step.run('check-price-alerts', async () => {
      try {
        const triggeredAlerts = await checkPriceAlerts();
        
        return {
          success: true,
          triggeredCount: triggeredAlerts.length,
          triggeredAlerts: triggeredAlerts.map(alert => ({
            symbol: alert.symbol,
            targetPrice: alert.targetPrice,
            currentPrice: alert.currentPrice,
            alertType: alert.alertType
          }))
        };
      } catch (error) {
        console.error('Error checking price alerts:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }
);
