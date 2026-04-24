// Dashboard.jsx
import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useUser } from "../../hooks/userContext";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { getHarvestStatusColor, getStageColor, getSensorStatus, getTrayStatusColor } from "../../utils/colors.js";
import { useDarkMode } from "../../hooks/useDarkmode.jsx";
import { getSeasonLabel } from "@/utils/seasonUtils";

import { Menu, Droplet, ChevronDown, ChevronUp, Sprout, Calendar, Wifi,
WifiOff, TrendingUp, Clock, CircleQuestionMark, LayoutGrid, Leaf } from "lucide-react";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";

import { usePlantData } from "../../hooks/plantContext.jsx";
import { ESP32Context } from "../../hooks/esp32Hooks.jsx";
import InfosModal from '../../components/infosModal';
import ExcelDownloadBtn from "../../components/excelDownloadBtn.jsx";


export function Dashboard() {
  const { user } = useUser();
  const { openDeleteNotifModal, setOpenDeleteNotifModal, selectedNotif, deleteMode, messageContext, setMessageContext } = useContext(MessageContext);
  const { ESP32Status } = useContext(ESP32Context);
  const isDark = useDarkMode();

  const [isNotifOpen, setNotifOpen]         = useState(false);
  const [logoutOpen, setLogoutOpen]         = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [expandedZones, setExpandedZones]   = useState({});
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");

  const {
    trayGroups,
    trays,
    tgWithTrayCount,
    batches,
    sensors,
    latestReadings,
    loadTrayGroups,
    loadTrays,
    loadTrayGroupsWithCount,
    loadBatches,
    loadSensors,
    loadLatestReadings,
    loadNotifs,
  } = usePlantData();

  const clearMsg = useCallback(() => setMessageContext(""), []);

  useEffect(() => {
    loadTrayGroups();
    loadTrays();
    loadTrayGroupsWithCount();
    loadBatches();
    loadSensors();
  }, [loadTrayGroups, loadTrays, loadTrayGroupsWithCount, loadBatches, loadSensors]);

  useEffect(() => {
    const interval = setInterval(() => loadLatestReadings(), 5000);
    return () => clearInterval(interval);
  }, [loadLatestReadings]);

  const getMoistureStatus = (value, min, max) => {
    if (value === 0) return { status: 'inactive', color: '#94a3b8', label: 'Inactive' };
    if (value < min)  return { status: 'low',      color: '#dc2626', label: 'Low' };
    if (value > max)  return { status: 'high',     color: '#2563eb', label: 'High' };
    return { status: 'optimal', color: '#25a244', label: 'Optimal' };
  };

  const toggleZone = (zoneId) => setExpandedZones(prev => ({ ...prev, [zoneId]: !prev[zoneId] }));

  const handleOpenInfosModalNursery    = () => { setInfoModalPurpose("nursery");    setInfoModalOpen(true); };
  const handleOpenInfosModalTrayGroups = () => { setInfoModalPurpose("traygroups"); setInfoModalOpen(true); };
  const handleOpenInfosModalBatches    = () => { setInfoModalPurpose("batch");      setInfoModalOpen(true); };

  const sortedTrayGroups = useMemo(() => {
    if (!Array.isArray(trayGroups)) return [];
    return [...trayGroups].sort((a, b) =>
      String(a.tray_group_name).trim().toLowerCase()
        .localeCompare(String(b.tray_group_name).trim().toLowerCase(), "en")
    );
  }, [trayGroups]);

  const getTrayCount = (groupId) => {
    const g = tgWithTrayCount.find(g => g.tray_group_id === groupId);
    return g ? Number(g.tray_count) : 0;
  };

  const getTrayInfo = (tray_id) => {
    const tray = trays.find(t => t.tray_id === tray_id);
    if (!tray) return null;
    const groupTrays = trays
      .filter(t => t.tray_group_id === tray.tray_group_id)
      .sort((a, b) => a.tray_id - b.tray_id);
    const index = groupTrays.findIndex(t => t.tray_id === tray_id);
    return `Tray ${index + 1}. ${tray.plant}`;
  };

  const getTrayGroupInfo = (tray_id) => {
    const tray = trays.find(t => t.tray_id === tray_id);
    if (!tray) return null;
    const group = trayGroups.find(g => g.tray_group_id === tray.tray_group_id);
    return group ? group.tray_group_name : null;
  };

  // ─── BUILD BATCH EXCEL DATA ───────────────────────────────────────────────
  const batchExcelData = useMemo(() => {
    return batches.map((batch) => {
      const tray = trays.find(t => t.tray_id === batch.tray_id);
      const groupTrays = tray
        ? trays.filter(t => t.tray_group_id === tray.tray_group_id).sort((a, b) => a.tray_id - b.tray_id)
        : [];
      const trayIndex = tray ? groupTrays.findIndex(t => t.tray_id === tray.tray_id) : -1;
      return {
        "Batch Number":          batch.batch_number,
        "Plant Name":            batch.plant_name,
        "Tray":                  tray ? `Tray ${trayIndex + 1} ${tray.plant}` : "—",
        "Date Planted":          new Date(batch.date_planted).toLocaleDateString(),
        "Expected Harvest Days": batch.expected_harvest_days,
        "Growth Stage":          batch.growth_stage,
        "Harvest Status":        batch.harvest_status,
        "Season":                getSeasonLabel(batch.season),
        "Total Seedlings":       batch.total_seedlings,
        "Fully Grown":           batch.fully_grown_seedlings,
        "Dead":                  batch.dead_seedlings,
        "Replanted":             batch.replanted_seedlings,
      };
    });
  }, [batches, trays]);

  const excelSheets = useMemo(() => {
    const trayGroupsSheet = sortedTrayGroups.map((group) => ({
      "Group ID":       group.tray_group_id,
      "Group Name":     group.tray_group_name,
      "Location":       group.location,
      "Min Moisture %": group.min_moisture,
      "Max Moisture %": group.max_moisture,
      "Tray Count":     getTrayCount(group.tray_group_id),
    }));

    const traysSheet = trays.map((tray) => {
      const group         = trayGroups.find(g => g.tray_group_id === tray.tray_group_id);
      const sensor        = sensors.find(s => s.tray_id === tray.tray_id && s.sensor_type === "moisture");
      const readingsArray = Array.isArray(latestReadings) ? latestReadings : [];
      const latestReading = sensor ? readingsArray.find(r => r.sensor_id === sensor.sensor_id) : null;
      const moistureValue = latestReading ? Number(latestReading.value) : 0;

      let moistureStatus = "Inactive";
      if (moistureValue > 0 && group) {
        if (moistureValue < group.min_moisture)      moistureStatus = "Low";
        else if (moistureValue > group.max_moisture) moistureStatus = "High";
        else                                         moistureStatus = "Optimal";
      }

      const groupTrays = trays
        .filter(t => t.tray_group_id === tray.tray_group_id)
        .sort((a, b) => a.tray_id - b.tray_id);
      const trayIndex = groupTrays.findIndex(t => t.tray_id === tray.tray_id);

      return {
        "Tray":            `Tray ${trayIndex + 1}`,
        "Plant":           tray.plant,
        "Status":          tray.status,
        "Tray Group":      group?.tray_group_name ?? "—",
        "Moisture %":      moistureValue,
        "Moisture Status": moistureStatus,
        "Sensor ID":       sensor?.sensor_id ?? "No sensor",
      };
    });

    return [
      { sheetName: "Tray Groups", data: trayGroupsSheet },
      { sheetName: "Trays",       data: traysSheet       },
      { sheetName: "Batches",     data: batchExcelData   },
    ];
  }, [sortedTrayGroups, trays, trayGroups, sensors, latestReadings, batchExcelData]);

  if (!user) return <div>Loading...</div>;

  return (
    <section className="con_main w-full min-h-screen bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] flex flex-col md:grid md:grid-cols-[15fr_85fr] md:grid-rows-[auto_1fr] gap-4 overflow-hidden relative">

      {/* MOBILE MENU */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block md:row-span-full`}>
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* RIGHT COLUMN */}
      <div className="md:col-start-2 flex flex-col gap-4 overflow-y-auto pb-4">

        <Db_Header setNotifOpen={setNotifOpen} />

        <div className="w-full max-w-full sm:max-w-7xl mx-auto space-y-4 px-4 sm:px-0">

          {/* Top Card */}
          <div className="conb bg-white rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 w-full">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 flex items-center flex-wrap">
                  Nursery Dashboard
                  <button className='ml-2 sm:ml-4 mt-2 sm:mt-0 flex-shrink-0' onClick={handleOpenInfosModalNursery}>
                    <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
                  </button>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  Monitor and manage your plant cultivation
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <ExcelDownloadBtn
                  sheets={excelSheets}
                  filename={`nursery-dashboard-${new Date().toISOString().slice(0, 10)}`}
                  multi
                />
                <div className="conb flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-md border border-gray-50 flex-1 sm:flex-none">
                  {ESP32Status ? (
                    <>
                      <Wifi size={24} className="text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-[var(--color-dark-blue)] truncate m-0">Watering System Online</p>
                        <p className="text-xs text-[var(--gray_1--)] mt-1 truncate m-0">Last updated: Just now</p>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_currentColor] flex-shrink-0" />
                    </>
                  ) : (
                    <>
                      <WifiOff size={24} className="text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-[var(--color-dark-blue)] truncate m-0">Watering System Offline</p>
                        <p className="text-xs text-[var(--gray_1--)] mt-1 truncate m-0">Trying to reconnect...</p>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_currentColor] flex-shrink-0" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid — Tray Groups + Batches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">

            {/* LEFT — Tray Groups */}
            <div className="tray_groups_main_div lg:col-span-2 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] w-full">
              {trayGroups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Sprout size={48} className="mb-3 opacity-50" />
                  <p className="text-lg font-medium">No Tray Groups found</p>
                  <p className="text-sm">Create a tray group to start tracking plants</p>
                </div>
              )}

              {sortedTrayGroups.map((group) => {
                const isExpanded = expandedZones[group.tray_group_id];

                const groupTrays = trays
                  .filter(t => t.tray_group_id === group.tray_group_id)
                  .sort((a, b) => a.tray_id - b.tray_id);

                return (
                  <div key={group.tray_group_id} className="main_tray_group_div conb bg-white rounded-3xl shadow-lg overflow-hidden w-full">
                    <div
                      className="tray_group_div p-4 sm:p-6 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => toggleZone(group.tray_group_id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A8C7B8] to-[#7BA591] flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className='flex'>
                              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {group.group_number} {group.tray_group_name}
                              </h2>
                              <button onClick={(e) => { e.stopPropagation(); handleOpenInfosModalTrayGroups(); }} className='mx-2'>
                                <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
                              </button>
                            </div>
                            <div className='flex gap-4'>
                              <p className="text-xs sm:text-sm text-gray-500">{group.location}</p>
                              <p className='text-xs sm:text-sm text-gray-500'>Trays: {getTrayCount(group.tray_group_id)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Threshold</p>
                            <p className="text-sm font-medium text-gray-900">{group.min_moisture}% - {group.max_moisture}%</p>
                          </div>
                          <div className="dropdown_nursery w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                          {groupTrays.map((tray, index) => {
                            const sensor = sensors.find(s => s.tray_id === tray.tray_id && s.sensor_type === "moisture");
                            const readingsArray = Array.isArray(latestReadings) ? latestReadings : [];
                            const latestMoistureReading = sensor ? readingsArray.find(r => r.sensor_id === sensor.sensor_id) : null;
                            const moistureValue = latestMoistureReading ? Number(latestMoistureReading.value) : 0;
                            const trayStatusColors = getTrayStatusColor(tray.status, isDark);
                            const sensorStatus = getSensorStatus(sensor, moistureValue, !!sensor, group, isDark);

                            return (
                              <div key={tray.tray_id} className="con_c tray_list_div bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-2xl p-4 hover:shadow-md transition-shadow w-full">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center justify-between w-full">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      Tray {index + 1}. {tray.plant}
                                    </h3>
                                    <span
                                      className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                                      style={{
                                        backgroundColor: trayStatusColors.bg,
                                        color: trayStatusColors.text,
                                        border: `1px solid ${trayStatusColors.border}`
                                      }}>
                                      {tray.status}
                                    </span>
                                  </div>
                                </div>

                                {sensor && (
                                  <div className="sensor_div bg-white rounded-xl p-4 shadow-sm w-full">
                                    <div className="flex items-center justify-between">
                                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={sensorStatus.bgStyle}>
                                        <Droplet className="w-10 h-8" style={sensorStatus.iconStyle} />
                                      </div>
                                      <div className="flex-1 mx-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Moisture Sensor</p>
                                        <p className="text-2xl font-bold text-gray-900">{moistureValue}%</p>
                                      </div>
                                      <div className="flex">
                                        <div
                                          className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                                          style={{
                                            backgroundColor: `${sensorStatus.iconStyle.color}15`,
                                            color: sensorStatus.iconStyle.color
                                          }}>
                                          {sensorStatus.label}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            {/* RIGHT — Batches */}
            <div className="conb bg-[var(--main-whiteb)] rounded-3xl p-4 sm:p-6 shadow-sm w-full">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Plant Batches</h2>
                    <button onClick={handleOpenInfosModalBatches}>
                      <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
                    </button>
                  </div>
                  <ExcelDownloadBtn
                    data={batchExcelData}
                    filename={`batches-${new Date().toISOString().slice(0, 10)}`}
                    sheetName="Active Batches"
                  />
                </div>
              </div>

              <div className="batch_scroll_div space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto w-full">
                {batches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Sprout size={48} className="mb-3 opacity-50" />
                    <p className="text-lg font-medium">No Batches found</p>
                    <p className="text-sm">Assign a batch to each tray to start tracking plants</p>
                  </div>
                ) : (
                  batches.map(batch => {
                    const stageColors   = getStageColor(batch.growth_stage, isDark);
                    const harvestColors = getHarvestStatusColor(batch.harvest_status, isDark);
                  
                    const trayInfo      = getTrayInfo(batch.tray_id);
                    const trayGroupInfo = getTrayGroupInfo(batch.tray_id);

                    return (
                      <div key={batch.batch_id} className="batch_div bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-4 border border-gray-100 w-full">
                        <div className="flex items-start justify-between flex-col mb-3">
                          <h3 className="text-base font-semibold text-gray-900">[{batch.batch_number}] {batch.plant_name}</h3>

                          {trayInfo && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <LayoutGrid className="w-3 h-3 text-[#25a244]" />
                              <span className="text-[11px] text-[#25a244] font-medium">{trayInfo}</span>
                            </div>
                          )}

                          {trayGroupInfo && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <LayoutGrid className="w-3 h-3 text-[var(--sancga)]" />
                              <span className="text-[11px] text-[var(--sancga)] font-medium">
                                {trayGroupInfo}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">Planted: {new Date(batch.date_planted).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">
                              Harvest at: {batch.expected_harvest_days} {batch.expected_harvest_days === 1 ? "day" : "days"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Sprout className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-500">Growth Stage:</span>
                            <span
                              className="px-2 py-0.5 rounded-2xl font-medium"
                              style={{ backgroundColor: stageColors.bg, color: stageColors.text, border: `1px solid ${stageColors.border}` }}
                            >
                              {batch.growth_stage}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-500">Harvest Status:</span>
                            <span className="flex flex-row items-center gap-1 font-medium" style={{ color: harvestColors.text }}>
                              <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: harvestColors.dot }} />
                              {batch.harvest_status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Leaf className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-500">Season:</span>
                            <span className="font-medium text-[#25a244]">{getSeasonLabel(batch.season)}</span>
                          </div>
                        </div>

                        <div className="active_plant_batches_nursery_data grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Seedlings</p>
                            <p className="total_seedlings_text text-lg font-bold text-[#25a244]">{batch.total_seedlings}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Grown</p>
                            <p className="fully_grown_seedlings_text text-lg font-bold text-[#208b3a]">{batch.fully_grown_seedlings}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Dead</p>
                            <p className="dead_seedlings_text text-lg font-bold text-[var(--color-danger-b)]">{batch.dead_seedlings}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Replants</p>
                            <p className="replanted_seedlings_text text-lg font-bold text-[var(--color-warning)]">{batch.replanted_seedlings}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODALS */}
      {openDeleteNotifModal && (
        <DeleteNotifModal
          isOpen={openDeleteNotifModal}
          selectedNotif={selectedNotif}
          deleteMode={deleteMode}
          onClose={() => setOpenDeleteNotifModal(false)}
          loadNotifs={loadNotifs}
        />
      )}

      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {isInfoModalOpen && (
        <InfosModal
          isInfosModalOpen={isInfoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          purpose={infoModalPurpose}
        />
      )}

      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}
      {messageContext && (
        <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />
      )}
    </section>


  );
}

export default Dashboard;