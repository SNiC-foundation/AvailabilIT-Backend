/**
 *  SudoSOS back-end API service.
 *  Copyright (C) 2020  Study association GEWIS
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import MailTemplate from './MailTemplate';
import MailContent from './MailContent';
import Partner from '../../entities/Partner';

interface Track {
  beginTime: Date;
  endTime: Date;
  name: string;
  location: string;
}

interface FinalParticipantInfoParams {
  name: string;
  ticketCode: string;
  track1: Track | undefined;
  track2: Track | undefined;
  track3: Track | undefined;
  partners: Partner[];
  logoPartners: Partner[];
  url?: string;
}

function formatTime(date: Date) {
  return date.toLocaleString('nl-NL', {
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
  });
}

function formatTrack(track?: Track) {
  return track ? `<strong>${formatTime(track.beginTime)} - ${formatTime(track.endTime)}:</strong> ${track.name} (${track.location})` : '??:?? - ??:??';
}

const reminder = new MailContent<FinalParticipantInfoParams>({
  getHTML: (context) => `
    <p>Dear ${context.name},</p>

    <p>We are looking forward to seeing you at <strong>AvailabilIT</strong> next week! In this email, we will give you an overview of all the last things you need to know for next week!</p>

    <h3>Program:</h3>
    <p>Your personal program is as follows:</p>
    <ul>
        <li><strong>09:00 - 09:45:</strong> Check-in</li>
        <li><strong>10:00 - 11:15:</strong> Opening & keynote: Will Git Be Around Forever? A List of Possible Successors</li>
        <li>${formatTrack(context.track1)}</li>
        <li><strong>12:45 - 13:45:</strong> Lunch</li>
        <li>${formatTrack(context.track2)}</li>
        <li>${formatTrack(context.track3)}</li>
        <li><strong>16:45 - 18:00:</strong> Closing & keynote: Sustainability: The Hidden Impact of Developers</li>
        <li><strong>18:00 - 19:00:</strong> Drinks</li>
    </ul>

    <p>If you did not register on time, these slots have been automatically assigned. You can still change your slot registration, as there are still some sessions with a few spots left. You will find the full program, along with more information, in our <a href="https://availabilit.snic.nl/program-bookelet.pdf download="SNiC 2025 - Program"">program booklet</a>!</p>

    <p>Please make sure to visit the sessions you have signed up for, as some sessions are completely booked. This also means that it's important to not leave any empty seats between people.</p>

    <h3>To enter the event</h3>
    <p>You need a barcode to enter the event. This can be found in your personal account on the SNIC website: <a href="https://availabilit.snic.nl/home" target="_blank">https://availabilit.snic.nl/home</a>, as well below.</p>

    <p><img src="${context.url}/api/static/barcodes/${context.ticketCode}.png" alt="${context.ticketCode}"/><br></p>

    <h3>Before the event</h3>
    <p>There are two designated ways to travel to the event:</p>
    <ul>
        <li>If you're a student from Eindhoven, Enschede, Nijmegen, Leiden, or Groningen, a bus will be provided. You should receive information about this from your study association.</li>
        <li>Students from Utrecht and Amsterdam are expected to come on their own by public transport. The event location, Spant!, is within walking distance from the train station Bussum Zuid.</li>
    </ul>
    <p>Additionally, the conference does not require you to bring a bag or a laptop. If you do have a bag with you for some other reason, it can be stored in the cloakroom. Furthermore, take into account that this is a somewhat formal event, so dress accordingly.</p>

    <h3>During the event</h3>
    <p>Lunch and drinks are included in the event. If you have communicated your allergies during the registration on the website, allergy-free food will be provided. Do note that the kitchen cannot guarantee that cross-contamination will not occur. If this is a problem, please reach out to us.</p>
    <p>Alcoholic drinks will be served at the end of the event. Do not forget a valid identity document.</p>

    <p>We look forward to welcoming you on the 25th of November. If anything is unclear or if you have any questions, you can reach out to <a href="mailto:info@availabilit.snic.nl">info@availabilit.snic.nl</a>.</p>

    <p>With kind regards,</p>
    <p>The SNiC committee</p>
    
    SNiC 2025: AvailabilIT would not be possible without our partners. Below you can find a message from some of our partners.</p>
${context.partners.map((p) => `<hr>
<p style="white-space: pre-wrap">
<b><img width="200" src="${context.url}/api/static/${p.logoFilename}" alt="${p.name}"/></b><br>
${p.description}
</p><br>`).join(' ')}
${context.logoPartners.map((p) => `<hr>
<p style="white-space: pre-wrap">
<b><img width="200" src="${context.url}/api/static/${p.logoFilename}" alt="${p.name}"/></b><br>
`).join(' ')}
<br>
<p>See you Wednesday at AvailabilIT!</p>`,
  getSubject: () => 'Final information for SNiC 2025: AvailabilIT',
  getText: (context) => `
Dear ${context.name},

We are looking forward to seeing you at AvailabilIT next week! In this email, we will give you an overview of all the last things you need to know for next week!

Program:
Your personal program is as follows:
09:00 - 09:45: Check-in
10:00 - 11:15: Opening
${formatTrack(context.track1)}
12:45 - 13:45: Lunch
${formatTrack(context.track2)}
${formatTrack(context.track3)}
16:45 - 18:00: Closing
18:00 - 19:00: Drinks

If you did not register on time, these slots have been automatically assigned. You will find the full program, along with more information, as an attachment to this email.

Please make sure to visit the sessions you have signed up for, as some sessions are completely booked. This also means that it's important to not leave any empty seats between people.

To enter the event, you need a barcode which can be found in your personal account on the snic website: https://availabilit.snic.nl/home
 
Before the event 
There are two designated ways to travel to the event. If you're a student from Eindhoven, Enschede, Nijmegen, Leiden or Groningen, a bus will be provided. You should receive information about this from your study association. Students from Utrecht and Amsterdam are expected to come on their own by public transport. The event location, Spant!, is within walking distance from the train station Bussum Zuid.

Additionally, the conference does not require you to bring a bag or a laptop. If you do have a bag with you for some other reason, it can be stored in the cloakroom. Furthermore, take into account that this is a somewhat formal event, so dress accordingly. 

During the event
Lunch and drinks are included in the event. If you have communicated your allergies during the registration on the website, allergy-free food will be provided. Do note that the kitchen cannot be guaranteed that cross-contamination will not occur. If this is a problem, please reach out to us. 

Alcoholic drinks will be served at the end of the event. Do not forget a valid identity document.

We look forward to welcoming you on the 25th of November. If anything is unclear or if you have any questions, you can reach out to info@availabilit.snic.nl

With kind regards,

The SNiC committee

Partners:
    SNiC 2025: AvailabilIT would not be possible without our partners. Below you can find a message from some of our partners.</p>

${context.partners.map((p) => `${p.name}
${p.description}`).join(`

`)}

See you Tuesday at AvailabilIT!`,
});

export default class FinalParticipantInfo extends MailTemplate<FinalParticipantInfoParams> {
  public constructor(options: FinalParticipantInfoParams) {
    const opt: FinalParticipantInfoParams = {
      ...options,
    };
    if (!options.url) {
      opt.url = process.env.URL;
    }
    super(opt, reminder);
  }
}
