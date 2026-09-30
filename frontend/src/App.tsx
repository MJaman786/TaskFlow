import { SkeletonTheme } from 'react-loading-skeleton';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AppRoutes } from './routes/routeConfig';
import ProtectedRoutes from './common/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import DynamicRoleLayout from './common/Layout/DynamicRoleLayout';
import NotFound from './pages/PageNotFound/NotFound';

export default function App() {
    return (
        <>
            <BrowserRouter>
                <SkeletonTheme baseColor="#dee2e6" highlightColor="#f8f9fa" direction='ltr'>

                    <Routes>
                        {/* </Route> */}
                        {
                            AppRoutes.map((route) => {
                                // public routes
                                if (!route.isPrivate) {
                                    return (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={route.element}
                                        />
                                    )
                                }
                            })
                        }

                        {/* private route */}
                        <Route element={<ProtectedRoutes />}>
                            {
                                AppRoutes.map((route) => {
                                    if (route.isPrivate) {
                                        return (
                                            // role based route
                                            <Route element={<RoleGuard allowedRoles={route.roles ?? []} />}>
                                                <Route element={<DynamicRoleLayout activePage={route.activePage!} />}>
                                                    <Route
                                                        key={route.path}
                                                        path={route.path}
                                                        element={route.element}
                                                    />
                                                </Route>
                                            </Route>
                                        )
                                    }
                                })
                            }
                        </Route>
                        {/* No Route Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </SkeletonTheme>
            </BrowserRouter>
        </>
    )
}