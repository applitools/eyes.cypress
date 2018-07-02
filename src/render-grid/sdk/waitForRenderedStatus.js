'use strict';
const {RenderStatus} = require('@applitools/eyes.sdk.core');
const {promisify: p} = require('util');

const GET_STATUS_INTERVAL = 500; // TODO take from SDK?
const TIMEOUT = 120000; // 2 minutes of timeout
const psetTimeout = p(setTimeout);

async function waitForRenderedStatus(renderIds, wrapper) {
  async function getStatus() {
    if (timeoutReached) {
      wrapper._logger.verbose('waitForRenderedStatus: timeout reached');
      return;
    }

    try {
      const renderStatuses = await wrapper.getRenderStatus(renderIds);
      const error = renderStatuses.find(
        rs => (rs.getStatus() === RenderStatus.ERROR ? rs.getError() : null),
      );
      if (error) {
        throw error;
      }

      const statuses = renderStatuses.map(rs => rs.getStatus());
      if (statuses.some(status => !status || status === RenderStatus.RENDERING)) {
        await psetTimeout(GET_STATUS_INTERVAL);
        return await getStatus();
      }

      clearTimeout(timeoutId);
      return renderStatuses.map(rs => rs.getImageLocation());
    } catch (ex) {
      wrapper._logger.log(`error during getRenderStatus: ${ex}`);
      await psetTimeout(GET_STATUS_INTERVAL); // TODO use GeneralUtils from SDK?
      return await getStatus();
    }
  }

  let timeoutReached = false;
  const timeoutId = setTimeout(() => (timeoutReached = true), TIMEOUT);
  return await getStatus();
}

module.exports = waitForRenderedStatus;

/*****
 * TODO: when this is rewritten to be optimized, it should query status for multiple renderIds

  async function getRenderStatus(renderIds) {
    // TODO send POST to /render-status (_serverConnector.getRenderStatusByIds)
    // TODO remove completed renderIds from array
    // TODO call matchWindow on completed renderIds
  }

 */
