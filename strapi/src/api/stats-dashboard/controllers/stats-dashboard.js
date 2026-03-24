'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::stats-dashboard.stats-dashboard');
