import { Activity, ActivityType } from '../../model/activities';

const instances = [
  {
    title:"软件学院2018年秋季运动会",
    description:"积极参与体育活动，加强身体素质锻炼，丰富软件人的课余生活，形成“团结、凝聚、拼搏”的精神风貌。",
    time:{ start: new Date('2018-10-29T09:00:00'), end: new Date('2018-10-29T18:00:00') },
    location:{ text: '生活区田径场'},
    actype:'culsport',
    score:"Ranking Based",
    capacity:"No Limited",
    state:2
  },
  {
    title:"2018级迎新晚会 金秋展艺 码上生花",
    description:"三院联合主办「金秋展艺 码上生花」迎新晚会,于11月4日晚19:00在学术大讲堂召开。在这场热火朝天的晚会里,三个学院的同学为2023级的新生们带来了赏心悦目的艺术表演。",
    time:{ start: new Date('2018-11-04T19:00:00'), end: new Date('2018-11-04T22:00:00') },
    location:{ text: '学术大讲堂'},
    actype:'moral',
    score:0.5,
    capacity:200,
    state:1
  },
  {
    title:"2018级新生杯ACM程序设计大赛",
    description:"为了激发同学们对编程的兴趣,提高同学们编程的能力,举行了第十届新生杯ACM程序设计大赛。",
    time:{ start: new Date('2018-11-11T11:30:00'), end: new Date('2018-11-11T17:30:00') },
    location:{ text: '教学区B7-138室'},
    actype:'intellectual',
    score:"Ranking Based",
    capacity:50,
    state:0
  },
    {
      title: "软件学院2019年春季运动会",
      description: "促进团队合作，提高身体素质，展现软件人的活力与团结。",
      time: { start: new Date('2019-04-15T10:00:00'), end: new Date('2019-04-15T17:00:00') },
      location: { text: '生活区田径场' },
      actype: 'culsport',
      score: "Ranking Based",
      capacity: "No Limited",
      state: 2
    },
    {
      title: "软工专业技术交流会",
      description: "分享最新的软件工程技术，推动软工专业同学在技术领域的发展。",
      time: { start: new Date('2019-05-20T14:00:00'), end: new Date('2019-05-20T17:00:00') },
      location: { text: '实验楼A-205室' },
      actype:'intellectual',
      score: 0.2,
      capacity: 100,
      state: 1
    },
    {
      title: "校园环保日志愿活动",
      description: "参与环保志愿者活动，共同营造绿色校园。",
      time: { start: new Date('2019-06-05T09:00:00'), end: new Date('2019-06-05T15:00:00') },
      location: { text: '校园各处' },
      actype: 'moral',
      score: 0.5,
      capacity: "No Limited",
      state: 0
    },
];
  

export default instances;