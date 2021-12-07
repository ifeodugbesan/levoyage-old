class NotificationsController < ApplicationController
  def index
    @notifications = policy_scope(current_user.notifications).newest_first
  end
end
