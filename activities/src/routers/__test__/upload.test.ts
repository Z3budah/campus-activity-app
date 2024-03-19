import request from 'supertest';
import { app } from '../../app';
import path from 'path';


it('upload file and delete it', async () => {
  const cookie = global.signin();

  const filePath = path.resolve(__dirname, './grass.jpg');

  const response = await request(app)
    .post('/api/activities/upload')
    .set('Cookie', cookie)
    .set('Content-Type', 'multipart/form-data')
    .attach('file', filePath);

  expect(response.status).toEqual(200);

  const pic = response.body.data.name;
  const response1 = await request(app)
    .delete(`/api/activities/upload/${pic}`)
    .set('Cookie', cookie)
    .send();

  console.log(response1.body);
  expect(response1.status).toEqual(200);

});
