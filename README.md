# JS
.php
function getSideSubMenu($parentId, $level = 1) {
  $submenulist = DB::select(DB::raw("
    select m.id, m.modulename, m.url, m.icon
    from modules m
    join module_permission mp on m.id=mp.modulesid
    where m.parentmoduleid = ? and
          mp.usertypeid = ?
    group by m.id, m.modulename, m.url, m.icon
    order by m.orderby
  "), [$parentId, $userdata->usertype]);

  $html = '';
  foreach ($submenulist as $subli) {
    $submenu = getSideSubMenu($subli->id, $level + 1); // Recursive call with level tracking
    $html .= '<li class="sidebar-item">';
    $html .= '<a class="sidebar-link" href="' . url('/admin/' . $subli->url) . '">' . $subli->modulename . '</a>';
    if ($submenu && $level < 3) { // Check level and existence of submenu
      $html .= '<ul class="sidebar-dropdown list-unstyled">';
      $html .= $submenu;
      $html .= '</ul>';
    }
    $html .= '</li>';
  }
  return $html;
}

.blade.php page

<ul class="sidebar-nav">
    <li class="sidebar-header">Pages</li>

    @php
        $menulist = getSideMenu();
        $path = Request::path();
    @endphp

    @foreach($menulist as $li)
        @php
            $submenulist = getSideSubMenu($li->id);
        @endphp

        @if(count($submenulist) > 0)
            @php
                $isactive = '';
                $collapsed = 'collapsed';
                $ariaexpanded = 'false';
                $iscollapse = 'collapse';

                if ($path == 'admin/' . $li->url || 
                   // Check path for active state in sub-submenus
                   strpos($path, 'admin/' . $li->url . '/') !== false) {
                    $isactive = 'active';
                    $collapsed = '';
                    $ariaexpanded = 'true';
                    $iscollapse = '';
                }
            @endphp

            <li class="sidebar-item {{$isactive}}">
                <a data-bs-toggle="collapse" href="#{{ preg_replace('/\s/', '', $li->modulename) }}" class="sidebar-link {{$collapsed}}" aria-expanded="{{$ariaexpanded}}">
                    <i class="align-middle {{$li->icon}}" data-feather="layout"></i> <span class="align-middle">{{$li->modulename}}</span>
                </a>

                <ul id="{{ preg_replace('/\s/', '', $li->modulename) }}" class="sidebar-dropdown list-unstyled {{$iscollapse}}" data-bs-parent="#sidebar">
                    @foreach($submenulist as $subli)
                        @php
                            $subsubmenulist = getSideSubMenu($subli->id); // Additional call for sub-submenus
                        @endphp

                        <li class="sidebar-item @if($path == 'admin/' . $subli->url) active @endif">
                            <a class="sidebar-link" href="{{ url('/admin/' . $subli->url) }}">{{ $subli->modulename }}</a>

                            @if(count($subsubmenulist) > 0)
                                <ul class="sidebar-dropdown list-unstyled nested-submenu">
                                    @foreach($subsubmenulist as $subsubli)
                                        <li class="sidebar-item @if(strpos($path, 'admin/' . $subsubli->url . '/') !== false) active @endif">
                                            <a class="sidebar-link" href="{{ url('/admin/' . $subsubli->url) }}">{{ $subsubli->modulename }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            @endif
                        </li>
                    @endforeach
                </ul>
            </li>
        @else
            <li class="sidebar-item @if($path == 'admin/' . $li->url) active @endif">
                <a class="sidebar-link" href="{{ url('/admin/' . $li->url) }}">
                    <i class="align-middle {{$li->icon}}" ></i> <span class="align-middle">{{$li->modulename}}</span>
                </a>
            </li>
        @endif
    @endforeach
</ul>



next possible code

function getSideMenu()
{
    $userdata = getUserDetail();

    // Fetch all modules with permission check
    $menu = DB::select(DB::raw("
        select m.id, m.modulename, m.url, m.icon, m.parentmoduleid
        from modules m
        join module_permission mp on m.id=mp.modulesid
        where mp.usertypeid = ?
        order by m.orderby
    "), [$userdata->usertype]);

    // Build hierarchical menu using recursion
    $menuList = [];
    foreach ($menu as $item) {
        $menuItem = [
            'id' => $item->id,
            'modulename' => $item->modulename,
            'url' => $item->url,
            'icon' => $item->icon,
            'submenus' => [],
        ];

        // Recursive call for child menus
        if ($item->parentmoduleid > 0) {
            $menuItem['submenus'] = getNestedMenus($item->parentmoduleid, $menu);
        }

        $menuList[] = $menuItem;
    }

    return $menuList;
}

// Helper function for nested menu retrieval
function getNestedMenus($parentId, $menu)
{
    $submenus = [];
    foreach ($menu as $item) {
        if ($item->parentmoduleid == $parentId) {
            $menuItem = [
                'id' => $item->id,
                'modulename' => $item->modulename,
                'url' => $item->url,
                'icon' => $item->icon,
                'submenus' => [],
            ];

            // Recursive call for further nested levels
            if (count(array_filter($menu, function ($innerItem) use ($item) {
                return $innerItem->parentmoduleid == $item->id;
            })) > 0) {
                $menuItem['submenus'] = getNestedMenus($item->id, $menu);
            }

            $submenus[] = $menuItem;
        }
    }
    return $submenus;
}
