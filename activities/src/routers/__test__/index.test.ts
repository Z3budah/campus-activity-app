import request from 'supertest';
import { app } from '../../app';
import instances from './instances';
import { Activity } from '../../model/activities';
import { response } from 'express';

function createCounter() {
  let count = 0;

  function increment() {
    count = (count + 1)%6;
    return count;
  }

  return increment;
}

const counter = createCounter();

const createTicket = async (x:number,user?:any) => {
  if(!user){
    user = global.signin();
  }
  for(let i=0;i<x;i++){
    const activityIns = instances[counter()];
    await request(app).post('/api/activities').set('Cookie',user).send(activityIns);
  }
};


it('can fetch a list of activities', async () => {
  await createTicket(3);

  const response = await request(app).get('/api/activities').send().expect(200);

  expect(response.body.length).toEqual(3);
});

it('can fetch a list of activities with state=1', async () => {
  await createTicket(6);

  const response = await request(app).get('/api/activities?state=1').send().expect(200);
  expect(response.body).toBeInstanceOf(Array);

  for (const activity of response.body) {
    expect(activity.state).toBe(1);
  }
});


it('can fetch a list of activities created by the same user', async () => {
  //first user
  let user = global.signin();
  await createTicket(3,user);
  let response = await request(app).get('/api/activities?pub=true').set('Cookie', user).send().expect(200);
  expect(response.body.length).toEqual(3);
  //second user
  user = global.signin();
  await createTicket(1,user);
  response = await request(app).get('/api/activities?pub=true').set('Cookie', user).send().expect(200);
  expect(response.body.length).toEqual(1);
});
