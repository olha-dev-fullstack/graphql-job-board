import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompanyId,
  updateJob,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: async () => getJobs(),
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No Job found with id " + id);
      }
      return job;
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // TODO set based on user
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
    },
  },

  Company: {
    jobs: async (company) => getJobsByCompanyId(company.id),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

const toIsoDate = (value) => value.slice(0, "yyyy-mm-dd".length);

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
