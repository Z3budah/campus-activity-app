import { Publisher, RegCancelledEvent, Subjects } from "@zecamact/common";

export class RegCancelledPublisher extends Publisher<RegCancelledEvent>{
  subject: Subjects.RegCancelled = Subjects.RegCancelled;
}

