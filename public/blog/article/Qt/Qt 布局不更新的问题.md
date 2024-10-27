# Qt 布局不更新的问题

## 修改 QWidget 

在 QWidget 已经加入布局之后，修改其大小，布局不会自动更新。需要调用 `QWidget::updateGeometry` 方法。

> 类似的，修改子布局时需要调用 `QLayout::updateGeometry` 方法。

## 修改 QSpacerItem

在 QSpacerItem 已经加入布局之后，修改其大小，布局不会自动更新。需要调用 `QLayout::invalidate` 方法。

另外还可以调用 `QWidget::adjustSize` 方法调整大小.