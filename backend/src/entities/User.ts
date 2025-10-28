import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import BaseEnt from './BaseEnt';
import Role from './Role';
// eslint-disable-next-line import/no-cycle
import Participant, { UpdateParticipantParams } from './Participant';
// eslint-disable-next-line import/no-cycle
import Ticket from './Ticket';
// eslint-disable-next-line import/no-cycle
import Partner from './Partner';
// eslint-disable-next-line import/no-cycle
import SubscribeActivity from './SubscribeActivity';
// eslint-disable-next-line import/no-cycle
import TicketScan from './TicketScan';
// eslint-disable-next-line import/no-cycle
import LocalAuthenticator from './Authentication/LocalAuthenticator';

export enum Language {
  // eslint-disable-next-line no-unused-vars
  ENGLISH = 'english',
  // eslint-disable-next-line no-unused-vars
  DUTCH = 'dutch',
}

export interface CreateParticipantUserParams {
  email: string;
  name: string;
  dietaryWishes: string;
  needs: string;
  agreeToPrivacyPolicy: boolean;
  languages: Language[];
  participantInfo: {
    studyProgram: string;
  }
}

export interface PersonalUserParams {
  name: string;
  dietaryWishes: string;
  needs: string;
  languages: Language[];
  participantInfo?: UpdateParticipantParams;
}

export interface UserParams extends PersonalUserParams {
  email: string;
  agreeToPrivacyPolicy: boolean;
  partnerId?: number | null;
}

@Entity()
export default class User extends BaseEnt {
  @Column({ unique: true })
    email: string;
  
  @BeforeInsert()
  @BeforeUpdate()
  formatEmail() {
    this.email = this.email.toLowerCase();
  }

  @Column()
    name: string;

  @Column({ default: false })
    emailVerified: boolean;

  @Column({ type: 'text', nullable: true })
    dietaryWishes: string;

  @Column({ type: 'text', nullable: true })
    needs: string;

  @Column()
    agreeToPrivacyPolicy: boolean;

  @Column({
    type: 'json',
    default: '[]',
  })
    languages: Language[];

  @OneToOne(() => Participant, (participant) => participant.user, { nullable: true, eager: true, cascade: ['insert', 'update', 'remove'] })
    participantInfo?: Participant;

  @ManyToMany(() => Role)
  @JoinTable()
    roles: Role[];

  @OneToOne(() => Ticket, (ticket) => ticket.user, { nullable: true, onDelete: 'SET NULL' })
    ticket?: Ticket;

  @Column({ nullable: true })
    partnerId?: number | null;

  @ManyToOne(() => Partner, { nullable: true })
  @JoinColumn({ name: 'partnerId' })
    partner?: Partner | null;

  @ManyToMany(() => SubscribeActivity, (act) => act.subscribers, { onDelete: 'CASCADE' })
  @JoinTable()
    subscriptions: SubscribeActivity[];

  @OneToMany(() => TicketScan, (scan) => scan.user)
    scans: TicketScan[];

  @OneToOne(() => LocalAuthenticator, (auth) => auth.user, { nullable: true })
    identity?: LocalAuthenticator;
}
