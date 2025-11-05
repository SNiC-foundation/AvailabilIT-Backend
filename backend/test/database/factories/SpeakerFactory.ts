import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import Speaker, { SpeakerParams, SpeakerType } from '../../../src/entities/Speaker';
import Factory from './Factory';

export default class SpeakerFactory extends Factory<Speaker> {
  constructor(dataSource: DataSource) {
    super();
    this.repo = dataSource.getRepository(Speaker);
  }

  private constructObject(): Speaker {
    const params: SpeakerParams = {
      name: faker.person.fullName(),
      description: faker.word.noun(),
      title: faker.word.noun(),
      type: faker.helpers.arrayElement(Object.values(SpeakerType)),
    };

    const speaker = new Speaker();
    speaker.name = params.name;
    speaker.description = params.description;
    speaker.title = params.title;
    speaker.type = params.type;
    return speaker;
  }

  async createSingle(): Promise<Speaker> {
    const speaker = this.constructObject();
    return this.repo.save(speaker);
  }

  createMultiple(amount: number): Promise<Speaker[]> {
    const activities: Speaker[] = [];

    for (let i = 0; i < amount; i += 1) {
      activities.push(this.constructObject());
    }

    return this.repo.save(activities);
  }
}
