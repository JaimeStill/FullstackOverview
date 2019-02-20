using System;
using System.Linq;
using System.Threading.Tasks;
using FullstackOverview.Core.Sockets;
using FullstackOverview.Data.Entities;
using Microsoft.AspNetCore.SignalR;

namespace FullstackOverview.Web.Hubs
{
    public class ChannelHub : Hub
    {
        private SocketGroupProvider groups;

        public ChannelHub(SocketGroupProvider groups)
        {
            this.groups = groups;
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var connections = groups
                .SocketGroups
                .Where(x => x.Connections.Contains(Context.ConnectionId))
                .Select(x => x.Name)
                .ToList();

            foreach (var c in connections)
            {
                await groups.RemoveFromSocketGroup(Context.ConnectionId, c);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, c);
                await Clients.GroupExcept(c, Context.ConnectionId).SendAsync("groupAlert", $"{Context.UserIdentifier} has left {c}");
            }

            await base.OnDisconnectedAsync(ex);
        }

        public async Task triggerJoinChannel(string group)
        {
            await groups.AddToSocketGroup(Context.ConnectionId, group);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.GroupExcept(group, Context.ConnectionId).SendAsync("channelAlert", $"{Context.User.Identity.Name} has joined {group}");
        }

        public async Task triggerLeaveChannel(string group)
        {
            await groups.RemoveFromSocketGroup(Context.ConnectionId, group);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            await Clients.GroupExcept(group, Context.ConnectionId).SendAsync("channelAlert", $"{Context.User.Identity.Name} has left {group}");
        }

        public async Task triggerChannelMessage(string group)
        {
            await Clients.Group(group).SendAsync("channelMessage");
        }
    }
}