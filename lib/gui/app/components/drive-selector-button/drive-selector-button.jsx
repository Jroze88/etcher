/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const propTypes = require('prop-types')
const Color = require('color')

const middleEllipsis = require('./../../utils/middle-ellipsis')

const { Provider, Txt } = require('rendition')
const { StepButton, StepNameButton, StepSelection,
  DetailsText, ChangeButton } = require('./../styled-components')

const DetailsModal = require('./../details-modal/details-modal')
const DriveSelectorReact = require('./../drive-selector-react/drive-selector-react')

const driveSelectorController = require('./../drive-selector-react/controller')

const shared = require('/./../../../../../lib/shared/units')
const constraints = require('./../../../../shared/drive-constraints')

class DriveSelectorButton extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showDetailsModal: false,
      showDriveSelector: false
    }
  }

  allDevicesFooter() {
    return driveSelectorController.getSelectedDrives().map((drive) =>
      <Txt key={drive.device} tooltip={drive.description + '(' + drive.displayName + ')'}>
        { middleEllipsis(drive.description, 14) }
      </Txt>
    )
  }

  selectedDevicesDetails() {
    return driveSelectorController.getSelectedDrives().map((device) =>
      ({
        name: device.description || device.displayName,
        size: shared.bytesToClosestUnit(device.size),
        path: device.device
      })
    )
  }

  render() {
    if (!driveSelectorController.hasDrive() && this.props.shouldShowDrivesButton) {
      return (
        <Provider>
          <StepSelection>
            <StepButton
              primary
              disabled={this.props.disabled}
              onClick={() => this.setState({ showDriveSelector: true })}
            >
              Select drive
            </StepButton>
            {this.state.showDriveSelector &&
              <DriveSelectorReact
                callback={() => this.setState({ showDriveSelector: false })}
              />
            }
          </StepSelection>
        </Provider>
      )
    }
    else {
      console.log(driveSelectorController.getDriveListLabel())
      return (
        <Provider>
          <StepSelection>
              <StepNameButton
                plaintext
                disabled={this.props.disabled}
                tooltip={driveSelectorController.getDriveListLabel()}
                warning={!driveSelectorController.hasDrive()}
                onClick={() => this.setState({ showDetailsModal: true})}
              >
                { middleEllipsis(driveSelectorController.getDrivesTitle(), 20) }
                { constraints.hasListDriveImageCompatibilityStatus &&
                  <Txt.span className='glyphicon glyphicon-alert'
                    ml='10px'
                    tooltip={constraints.getListDriveImageCompatibilityStatuses}
                  />
                }
              </StepNameButton>

            <DetailsText>
              {driveSelectorController.getDrivesSubtitle()}
            </DetailsText>
            { this.props.flashing || !this.props.shouldShowDrivesButton ?
              null
              :
              <ChangeButton
                plaintext
                onClick={() => this.setState({ showDriveSelector: true })}
              >
                Change
              </ChangeButton>
            }
            <DetailsText>
              {
                driveSelectorController.getSelectedDrives().length > 1 ?
                ( this.allDevicesFooter() )
                : null
              }
            </DetailsText>
          </StepSelection>
          {this.state.showDetailsModal ?
            <DetailsModal
              title={'SELECTED DRIVERS'}
              details={this.selectedDevicesDetails()}
              callback={() => this.setState({ showDetailsModal: false })}
            />
          : null
          }
          {this.state.showDriveSelector ?
            <DriveSelectorReact
              callback={() => this.setState({ showDriveSelector: false })} />
          : null
          }
        </Provider>
      )
    }
  }
}

DriveSelectorButton.propTypes = {
  disabled: propTypes.bool,
  flashing: propTypes.bool,
  shouldShowDrivesButton: propTypes.bool,
  hasCompatibilityStatus: propTypes.bool,
  getCompatibilityStatuses: propTypes.array
}

exports.DriveSelectorButton = DriveSelectorButton
