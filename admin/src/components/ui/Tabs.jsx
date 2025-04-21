"use client"

import React from "react"

function Tabs({ children, defaultValue, value, onValueChange }) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue)
    }
    onValueChange?.(newValue)
  }

  // Filter and transform children
  const tabsList = React.Children.toArray(children).find((child) => child.type === TabsList)

  const tabsContent = React.Children.toArray(children).filter((child) => child.type === TabsContent)

  const renderedTabsList = tabsList
    ? React.cloneElement(tabsList, {
        activeTab,
        onTabChange: handleTabChange,
      })
    : null

  const renderedContent = tabsContent.find((content) => content.props.value === activeTab)

  return (
    <div className="w-full">
      {renderedTabsList}
      {renderedContent}
    </div>
  )
}

function TabsList({ children, activeTab, onTabChange }) {
  const tabs = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsTrigger) {
      return React.cloneElement(child, {
        isActive: child.props.value === activeTab,
        onSelect: () => onTabChange(child.props.value),
      })
    }
    return child
  })

  return (
    <div className="flex w-full items-center">
      <div className="grid w-full grid-cols-2">{tabs}</div>
    </div>
  )
}

function TabsTrigger({ children, value, isActive, onSelect }) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? "bg-background shadow-sm" : "text-muted-foreground"
      }`}
      onClick={onSelect}
    >
      {children}
    </button>
  )
}

function TabsContent({ children, value }) {
  return <div className="mt-4">{children}</div>
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export { Tabs, TabsList, TabsTrigger, TabsContent }
export default Tabs
