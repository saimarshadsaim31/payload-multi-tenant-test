import type { CollectionConfig } from 'payload/types'

import richText from '../../fields/richText'
import { tenant } from '../../fields/tenant'
import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from './access/tenantAdmins'
import { tenants } from './access/tenants'
import formatSlug from './hooks/formatSlug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidatePage } from '../../hooks/revalidatePage'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { hero } from '../../fields/hero'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import { Archive } from '../../blocks/ArchiveBlock'
import { slugField } from '../../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${doc.slug !== 'home' ? doc.slug : ''}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePage],
    afterRead: [populateArchiveBlock],
  },
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [

        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    // {
    //   name: 'slug',
    //   label: 'Slug',
    //   type: 'text',
    //   index: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    //   hooks: {
    //     beforeValidate: [formatSlug('title')],
    //   },
    // },
    tenant,
    richText(),
    slugField(),
  ],
}
