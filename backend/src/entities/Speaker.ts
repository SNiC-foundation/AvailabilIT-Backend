import {
  Column, Entity, JoinTable, ManyToMany,
} from 'typeorm';
import BaseEnt from './BaseEnt';
// eslint-disable-next-line import/no-cycle
import Activity from './Activity';

export interface SpeakerLink {
  url: string;
  icon: string;
}

export enum SpeakerType {
  KEYNOTE = 'keynote',
  TALK = 'talk',
  HOST = 'host',
}

export interface SpeakerParams {
  name: string;
  title: string;
  description: string;
  links?: SpeakerLink[];
  tags?: string[];
  type: SpeakerType;
}

@Entity()
export default class Speaker extends BaseEnt {
  @Column()
    name: string;

  @Column({ type: 'text' })
    title: string;

  @Column({ type: 'text' })
    description: string;

  @Column({ type: 'json', nullable: true })
    links?: SpeakerLink[];

  @Column({ type: 'json', nullable: true })
    tags?: string[];

  @Column({ type: 'enum', enum: SpeakerType, default: SpeakerType.TALK })
    type: SpeakerType;

  @ManyToMany(() => Activity, (act) => act.speakers)
    activities: Activity[];

  @Column({ nullable: true })
    imageFilename?: string;
}
