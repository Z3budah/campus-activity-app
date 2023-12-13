import { Publisher, Subjects, ActivityCreatedEvent } from '@zecamact/common';

export class ActivityCreatedPublisher extends Publisher<ActivityCreatedEvent>{
  subject: Subjects.ActivityCreated = Subjects.ActivityCreated;
}