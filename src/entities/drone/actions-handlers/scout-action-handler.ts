import BaseActionHandler from '../../shared/base-action-handler';
import { findPositionInCircle, isInMap } from '../../../utils';
import Position from '../../shared/position';
import Resource from '../../resource';
import Drone from '../drone';

export default class ScoutActionHandler extends BaseActionHandler<Drone> {
  private _detectedResource: Resource;
  private readonly _resourceDetectionRange = 20;

  public reset(): void {
    this._detectedResource = null;
  }

  public handle(): boolean {
    this._forgetDetectedResourceIfInvalid();

    if (!this._entity.target) {
      this._entity.target = this._detectedResource?.position ?? this._findRandomTargetInTerritory();
    }

    if (this._entity.isNearFromTarget) {
      this._handleTargetReached();
    } else {
      this._entity.moveToTarget();

      if (!this._detectedResource) {
        this._detectResourceIfPossible();
      }
    }

    return true;
  }

  private _forgetDetectedResourceIfInvalid(): void {
    if (this._detectedResource) {
      const isResourceEmpty = this._detectedResource.stock <= 0;
      const isResourceAlreadyKnown = this._entity.hive.doesKnowResource(this._detectedResource.id);

      if (isResourceEmpty || isResourceAlreadyKnown) {
        this._detectedResource = null;
        this._entity.target = null;
      }
    }
  }

  private _findRandomTargetInTerritory(): Position {
    let newTarget;
    do {
      newTarget = findPositionInCircle(
        this._entity.hive.position,
        this._entity.hive.territoryRadius,
      );
    } while (!isInMap(newTarget));

    return newTarget;
  }

  private _detectNewResourcesInRange(): Resource[] {
    return this._entity.hive.detectNewResourcesInRange(
      this._entity.position,
      this._resourceDetectionRange,
    );
  }

  private _handleTargetReached(): void {
    this._entity.target = null;

    if (this._detectedResource) {
      this._entity.hive.addKnownResource(this._detectedResource);
      this._detectedResource = null;
    }
  }

  private _detectResourceIfPossible(): void {
    const detectedResources = this._detectNewResourcesInRange();
    const resource = detectedResources.length ? detectedResources[0] : null;

    if (resource) {
      this._detectedResource = resource;
      this._entity.target = resource.position;
    }
  }
}
