import { Publisher, Subjects, ActivityUpdatedEvent } from '@zecamact/common';

export class ActivityUpdatedPublisher extends Publisher<ActivityUpdatedEvent>{
  subject: Subjects.ActivityUpdated = Subjects.ActivityUpdated;
}