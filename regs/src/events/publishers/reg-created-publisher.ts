import { Publisher, RegCreatedEvent, Subjects } from "@zecamact/common";

export class RegCreatedPublisher extends Publisher<RegCreatedEvent>{
  subject: Subjects.RegCreated = Subjects.RegCreated;
}
