const fs = require('fs');
const path = 'src/components/MealPlanTab.tsx';
let text = fs.readFileSync(path, 'utf8');
const pattern = /    \/\/ Use Google Calendar URL - opens directly in calendar app on mobile[\s\S]*?    }\r\n  };/;
const replacement =     const formatGoogleCalendarDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const startStr = formatGoogleCalendarDate(start);
    const endStr = formatGoogleCalendarDate(end);
    const googleCalendarUrl = \https://calendar.google.com/calendar/render?action=TEMPLATE&text=\&dates=\/\&details=\&location=\\;
    const fileName = \quickdish-\-\.ics\;

    const downloadCalendarFile = () => {
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.download = fileName;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      URL.revokeObjectURL(url);
    };

    if (Capacitor.isNativePlatform()) {
      try {
        await App.openUrl({ url: googleCalendarUrl });
        toast({
          title:  Opening calendar,
          description: Add the event to your calendar,
        });
        return;
      } catch (error) {
        console.error('Native calendar open failed:', error);
        downloadCalendarFile();
        toast({
          title: Calendar file saved,
          description: Open the downloaded .ics file to add the event.,
        });
        return;
      }
    }

    const calendarWindow = window.open(googleCalendarUrl, '_blank');

    if (calendarWindow) {
      toast({
        title: Opening calendar,
        description: Add the event to your calendar,
      });
    } else {
      downloadCalendarFile();
      toast({
        title: Calendar file saved,
        description: Open the downloaded .ics file to add the event.,
      });
    }
  };;
if (!pattern.test(text)) {
  console.error('Pattern not found');
  process.exit(1);
}
text = text.replace(pattern, replacement);
fs.writeFileSync(path, text);
