import React from 'react'
import styled, { css } from 'styled-components'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import WindPowerIcon from '@mui/icons-material/WindPower'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { Device } from '../../../models/DataStore'

const TemperaturesContainer = styled.div<{ numcolumns: number }>`
  width: fit-content;
  align-self: center;
  position: relative;
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: 20px;
  ${({ numcolumns }) => css`
    grid-template-columns: repeat(${numcolumns}, 20px);
  `}
`

const FansContainer = styled.div`
  align-self: center;
  position: relative;
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: 20px;
`

const temperatureToHue = ({ current, high }) => {
  return (Math.pow(1 - current / high, 2) * 360) % 360
}

const Temperature = ({ current, high }) => {
  const color = temperatureToHue({ current, high })
  return (
    <div
      style={{
        backgroundColor: `hsl(${color}, 70%, 40%)`,
        transition: 'background-color 5s ease',
      }}
    />
  )
}

const PackageTemperature = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: grid;
  align-content: center;
  justify-content: center;
  font-weight: bold;
  text-shadow: 0 0 2px black;
`

interface TemperaturesProps {
  device: Device
}

export const Temperatures = observer<TemperaturesProps>(({ device }) => {
  const { temperatures } = device.status
  if (!temperatures || !temperatures.coretemp) {
    return null
  }
  return (
    <>
      <Tooltip title="coretemp">
        <DeviceThermostatIcon style={{ alignSelf: 'center' }} />
      </Tooltip>
      <TemperaturesContainer
        numcolumns={Math.ceil(Math.sqrt(temperatures.coretemp?.length))}
      >
        {temperatures.coretemp.slice(1).map((temperature, i) => (
          <Temperature key={`${temperature.label}_${i}`} {...temperature} />
        ))}
        <PackageTemperature>
          {temperatures.coretemp[0]?.current}℃
        </PackageTemperature>
      </TemperaturesContainer>
    </>
  )
})

interface FansProps {
  device: Device
}

export const Fans = observer<FansProps>(({ device }) => {
  const { nct6795, dell_smm } = device.status.fans
  if (!nct6795 && !dell_smm) {
    return null
  }
  return (
    <>
      <WindPowerIcon style={{ alignSelf: 'center' }} />
      <FansContainer>
        {nct6795 &&
          nct6795.map((fan, i) => (
            <span key={`nct6795_${i}`}>{fan.current} rpm</span>
          ))}
        {dell_smm &&
          dell_smm.map((fan, i) => (
            <span key={`dell_smm_${i}`}>{fan.current} rpm</span>
          ))}
      </FansContainer>
    </>
  )
})
