/*
 * Copyright 2019 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ApiRequestBuilder, ApiResult, ApiVersion} from "helpers/api_request_builder";
import {SparkRoutes} from "helpers/spark_routes";
import {PipelineActivity, Stage} from "models/pipeline_activity/pipeline_activity";
import {ResultAwarePage} from "views/pages/page_operations";

export class PipelineActivityService {
  private static API_VERSION_HEADER = ApiVersion.v1;

  activities(pipelineName: string, offset: number, page: ResultAwarePage<PipelineActivity>): void {
    ApiRequestBuilder.GET(SparkRoutes.apiPipelineActivity(pipelineName, offset), PipelineActivityService.API_VERSION_HEADER)
      .then((result) => this.onResult(result, page));
  }

  runStage(stage: Stage) {
    return ApiRequestBuilder.POST(
      SparkRoutes.runStage(stage.pipelineName(), stage.pipelineCounter(), stage.stageName()),
      PipelineActivityService.API_VERSION_HEADER)
  }

  cancelStageInstance(stage: Stage) {
    return ApiRequestBuilder.POST(
      SparkRoutes.cancelStageInstance(stage.pipelineName(), stage.pipelineCounter(), stage.stageName(), stage.stageCounter()),
      PipelineActivityService.API_VERSION_HEADER
    )
  }

  run(pipelineName: string) {
    return ApiRequestBuilder.POST(SparkRoutes.pipelineTriggerPath(pipelineName), PipelineActivityService.API_VERSION_HEADER);
  }

  pausePipeline(pipelineName: string, pauseCause: string) {
    return ApiRequestBuilder.POST(SparkRoutes.pipelinePausePath(pipelineName),
      PipelineActivityService.API_VERSION_HEADER,
      {payload: {pause_cause: pauseCause}});
  }

  unpausePipeline(pipelineName: string) {
    return ApiRequestBuilder.POST(SparkRoutes.pipelineUnpausePath(pipelineName), PipelineActivityService.API_VERSION_HEADER);
  }

  private onResult(result: ApiResult<string>, page: ResultAwarePage<PipelineActivity>) {
    return result.do((successResponse) => page.onSuccess(PipelineActivity.fromJSON(JSON.parse(successResponse.body))),
      (errorResponse) => page.onFailure(errorResponse.message));
  }
}