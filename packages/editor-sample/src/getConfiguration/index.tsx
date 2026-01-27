import EMPTY_EMAIL_MESSAGE from './sample/empty-email-message';
import RHEUMNOW_DAILY from './sample/rheumnow-daily';
import RHEUMNOW_DAILY_LOCAL from './sample/rheumnow-daily-local';

export default function getConfiguration(template: string) {
  if (template.startsWith('#sample/')) {
    const sampleName = template.replace('#sample/', '');
    switch (sampleName) {
      case 'rheumnow-daily':
        return RHEUMNOW_DAILY;
      case 'rheumnow-daily-local':
        return RHEUMNOW_DAILY_LOCAL;
    }
  }

  if (template.startsWith('#code/')) {
    const encodedString = template.replace('#code/', '');
    const configurationString = decodeURIComponent(atob(encodedString));
    try {
      return JSON.parse(configurationString);
    } catch {
      console.error(`Couldn't load configuration from hash.`);
    }
  }

  return EMPTY_EMAIL_MESSAGE;
}
