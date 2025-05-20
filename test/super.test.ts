import supertest from "supertest";

export const app = supertest(`http://localhost:${Bun.env.PORT || 8000}`);
