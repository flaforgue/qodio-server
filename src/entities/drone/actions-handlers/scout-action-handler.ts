import BaseActionHandler from './base-action-handler';
import { findTargetInCircle } from '../../../utils';
import Position from '../../position';
import Resource from '../../resource';

export default class ScourActionHandler extends BaseActionHandler {
  private _detectedResource?: Resource;
  private readonly _resourceDetectionRange = 30;

  public handle(): boolean {
    // forget resources discovered by other scouts
    if (this._detectedResource && this._drone.hive.doesKnowResource(this._detectedResource.id)) {
      this._detectedResource = null;
      this._drone.target = null;
    }

    if (!this._drone.target) {
      this._drone.target = this._detectedResource?.position ?? this._findRandomTargetInTerritory();
    }

    if (this._drone.isOnTarget()) {
      this._handleTargetReached();
    } else {
      this._drone.moveToTarget();

      if (!this._detectedResource) {
        this._detectResourceIfPossible();
      }
    }

    return true;
  }

  private _findRandomTargetInTerritory(): Position {
    return findTargetInCircle(this._drone.hive.position, this._drone.hive.territoryRadius);
  }

  private _detectNewResourcesInRange(): Resource[] {
    return this._drone.hive.detectNewResourcesInRange(
      this._drone.position,
      this._resourceDetectionRange,
    );
  }

  private _handleTargetReached(): void {
    this._drone.target = null;

    if (this._detectedResource) {
      this._drone.hive.addKnownResource(this._detectedResource);
      this._detectedResource = null;
    }
  }

  private _detectResourceIfPossible(): void {
    const detectedResources = this._detectNewResourcesInRange();
    const resource = detectedResources.length ? detectedResources[0] : null;

    if (resource) {
      this._detectedResource = resource;
      this._drone.target = resource.position;
    }
  }
}
