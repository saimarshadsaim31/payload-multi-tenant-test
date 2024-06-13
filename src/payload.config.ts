import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import { buildConfig } from 'payload/config'

import { Pages } from './collections/Pages'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Settings } from './globals/Settings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import Newsletter from './collections/Newsletter'

const mockModulePath = path.resolve(__dirname, './emptyModule.js')

export default buildConfig({
  collections: [Users, Tenants, Pages, Posts, Categories, Media, Projects, Newsletter],
  globals: [Settings, Header, Footer],
  admin: {
    bundler: webpackBundler(),
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        // alias: {
        //   ...config.resolve.alias,
        //   dotenv: path.resolve(__dirname, './dotenv.js'),
        // },
        alias: [
          'fs',
          'handlebars',
          'inline-css',
          path.resolve(__dirname, './email/transport'),
          path.resolve(__dirname, './email/generateEmailHTML'),
          path.resolve(__dirname, './email/generateForgotPasswordEmail'),
          path.resolve(__dirname, './email/generateVerificationEmail'),
        ].reduce(
          (aliases, importPath) => ({
            ...aliases,
            [importPath]: mockModulePath,
          }),
          {
            ...config.resolve.alias,
            dotenv: path.resolve(__dirname, './dotenv.js'),
          }
        ),
      },
    }),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
