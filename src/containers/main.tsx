import React, { useMemo, useState, useEffect } from 'react'

import {
  Mosaic,
  MosaicNode,
  MosaicBranch,
  MosaicPath,
} from 'react-mosaic-component'
import { MosaicKey } from 'react-mosaic-component/src/types'

import { useDragDropManager } from 'react-dnd'

import useErrors from '../hooks/useErrors'
import { load, save } from '../utils/storage'

import { useStores } from '../models'
import DragLayer from '../components/dragLayer'
import AppBar from '../components/appBar'
import Rooms from '../components/rooms'
import Table from '../components/table'
import Device from '../components/device'
import Calendar from '../components/calendar'
import Startup from './startup'

import { observer } from 'mobx-react-lite'
import { values } from 'mobx'
import KNXEvents from '../components/knxEvents'
import Errors from '../components/errors'
import usePageVisibility from '../hooks/usePageVisibility'

type MosaicElement = (path: MosaicBranch[]) => JSX.Element

const initialValue: MosaicNode<string> = null

const Main = () => {
  useErrors()
  const dragDropManager = useDragDropManager()
  const rootStore = useStores()
  const [loading, setLoading] = useState<boolean>(true)
  const [node, setNode] = useState<MosaicNode<string>>(initialValue)

  usePageVisibility(
    isVisible => {
      if (isVisible && !rootStore.isLoading && !rootStore.loaded) {
        rootStore.dataStore.fetchData()
        rootStore.start()
      }
    },
    [rootStore],
  )

  const element_map: { [viewId: MosaicKey]: MosaicElement } = useMemo(() => {
    if (rootStore.dataStore.isLoading) {
      return null
    }
    return {
      rooms: path => <Rooms path={path} />,
      devices: path => (
        <Table variant="devices" path={path} node={node} modelKey="devices" />
      ),
      ...values(rootStore.dataStore.devices).reduce(
        (acc, device: any) => ({
          ...acc,
          [`device_${device.id}`]: (path: MosaicPath) => (
            <Device path={path} target={device.id} />
          ),
        }),
        {},
      ),
      tags: path => (
        <Table variant="tags" path={path} node={node} modelKey="tags" />
      ),
      ...values(rootStore.dataStore.tags).reduce(
        (acc, tag: any) => ({
          ...acc,
          [`tag_${tag.id}`]: (path: MosaicPath) => (
            <Table
              node={node}
              path={path}
              filterVariant="tag"
              filter={tag.data}
              modelKey={`tag_${tag.id}`}
            />
          ),
        }),
        {},
      ),
      locations: path => (
        <Table
          variant="locations"
          path={path}
          node={node}
          modelKey="locations"
        />
      ),
      ...values(rootStore.dataStore.locations).reduce(
        (acc, location: any) => ({
          ...acc,
          [`location_${location.id}`]: (path: MosaicPath) => (
            <Table
              path={path}
              node={node}
              variant="devices"
              filterVariant="location"
              filter={location.data}
              modelKey={`location_${location.id}`}
            />
          ),
        }),
        {},
      ),
      calendar: path => <Calendar path={path} />,
      knx_events: path => <KNXEvents path={path} />,
      errors: path => <Errors path={path} />,
    }
  }, [
    node,
    rootStore.dataStore.isLoading,
    rootStore.dataStore.devices,
    rootStore.dataStore.tags,
    rootStore.dataStore.locations,
  ])

  useEffect(() => {
    if (loading) {
      load('mosaic')
        .then(storedNode => {
          if (storedNode) {
            setNode(storedNode)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => {
    if (!loading) {
      save('mosaic', node)
    }
  }, [loading, node])

  const isLoading = useMemo(() => {
    return (
      !element_map ||
      rootStore.dataStore.isLoading ||
      !rootStore.dataStore.wsConnected
    )
  }, [
    element_map,
    rootStore.dataStore.isLoading,
    rootStore.dataStore.wsConnected,
  ])

  if (isLoading) {
    return <Startup fullScreen />
  }

  return (
    <>
      <AppBar node={node} setNode={setNode} />
      <Mosaic<string>
        renderTile={(id, path) =>
          element_map[id] ? element_map[id](path) : null
        }
        initialValue={node}
        value={node}
        onRelease={node => setNode(node)}
        blueprintNamespace="bp5"
        className="mosaic-blueprint-theme bp5-dark bp4-dark"
        dragAndDropManager={dragDropManager}
      />
      <DragLayer />
    </>
  )
}

export default observer(Main)
